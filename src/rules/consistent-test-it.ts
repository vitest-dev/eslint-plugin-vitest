import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'
import {
  isTypeOfVitestFnCall,
  parseVitestFnCall,
} from '../utils/parse-vitest-fn-call'
import { TestCaseName } from '../utils/types'

const RULE_NAME = 'consistent-test-it'
export type MessageIds = 'consistentMethod' | 'consistentMethodWithinDescribe'

const buildFixer =
  (
    callee: TSESTree.Expression,
    nodeName: string,
    preferredTestKeyword: TestCaseName.test | TestCaseName.it,
  ) =>
  (fixer: TSESLint.RuleFixer) => [
    fixer.replaceText(
      callee.type === AST_NODE_TYPES.MemberExpression ? callee.object : callee,
      getPreferredNodeName(nodeName, preferredTestKeyword),
    ),
  ]

function getPreferredNodeName(
  nodeName: string,
  preferredTestKeyword: TestCaseName.test | TestCaseName.it,
) {
  if (nodeName === TestCaseName.fit) return 'test.only'

  return nodeName.startsWith('f') || nodeName.startsWith('x')
    ? nodeName.charAt(0) + preferredTestKeyword
    : preferredTestKeyword
}

function getOppositeTestKeyword(test: TestCaseName.test | TestCaseName.it) {
  if (test === TestCaseName.test) return TestCaseName.it

  return TestCaseName.test
}

/**
 * `parseVitestFnCall` reports the name the call *resolves* to, which is not
 * always the name that is written in the source: a binding created with
 * `test.extend()` resolves back to `test`, and an aliased import resolves back
 * to what it imports.
 *
 * This rule is about how the call is *spelled*, so a local name that is itself
 * a test keyword is what should be checked — `it(...)` already uses `it`, no
 * matter what it resolves to.
 */
const getWrittenName = (vitestFnCall: {
  name: string
  head: { local: string }
}) =>
  Object.hasOwn(TestCaseName, vitestFnCall.head.local)
    ? vitestFnCall.head.local
    : vitestFnCall.name

/**
 * The fixer rewrites the callee in place, which is only safe when the call
 * goes straight to the vitest export. Renaming an alias or a binding created
 * with `test.extend()` would point the call at a different function (or at no
 * binding at all), so those are reported without a fix.
 */
const isRenamable = (vitestFnCall: { name: string; head: { local: string } }) =>
  vitestFnCall.name === vitestFnCall.head.local

export default createEslintRule<
  [
    Partial<{
      fn: TestCaseName.it | TestCaseName.test
      withinDescribe: TestCaseName.it | TestCaseName.test
    }>,
  ],
  MessageIds
>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: 'enforce using test or it but not both',
      recommended: false,
    },
    messages: {
      consistentMethod:
        'Prefer using {{ testFnKeyWork }} instead of {{ oppositeTestKeyword }}',
      consistentMethodWithinDescribe:
        'Prefer using {{ testKeywordWithinDescribe }} instead of {{ oppositeTestKeyword }} within describe',
    },
    schema: [
      {
        type: 'object',
        properties: {
          fn: {
            description: 'Preferred global test function keyword.',
            type: 'string',
            enum: [TestCaseName.test, TestCaseName.it],
          },
          withinDescribe: {
            description: 'Preferred test function keyword inside `describe`.',
            type: 'string',
            enum: [TestCaseName.test, TestCaseName.it],
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [{}],
  },
  create(context, options) {
    const { fn, withinDescribe } = options[0]
    const testFnKeyWork = fn || TestCaseName.test
    const testKeywordWithinDescribe = withinDescribe || fn || TestCaseName.it
    const testFnDisabled =
      testFnKeyWork === testKeywordWithinDescribe ? testFnKeyWork : undefined
    const { sourceCode } = context

    let describeNestingLevel = 0

    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        if (testFnDisabled == null) return
        if (node.source.type !== 'Literal' || node.source.value !== 'vitest')
          return

        const oppositeTestKeyword = getOppositeTestKeyword(testFnDisabled)
        for (const specifier of node.specifiers) {
          if (specifier.type !== 'ImportSpecifier') continue
          if (specifier.imported.type !== 'Identifier') continue
          if (specifier.imported.name !== oppositeTestKeyword) continue

          context.report({
            node: specifier,
            data: { testFnKeyWork, oppositeTestKeyword },
            messageId: 'consistentMethod',
            fix: (fixer) => {
              const remainingSpecifiers = node.specifiers.filter(
                (spec) => spec !== specifier,
              )
              if (remainingSpecifiers.length > 0) {
                const hasPreferredSpecifier = remainingSpecifiers.some(
                  (spec) =>
                    spec.type === AST_NODE_TYPES.ImportSpecifier &&
                    spec.imported.type === AST_NODE_TYPES.Identifier &&
                    spec.imported.name === testFnDisabled,
                )
                const importNames = remainingSpecifiers.map((spec) =>
                  sourceCode.getText(spec),
                )
                if (!hasPreferredSpecifier) {
                  importNames.push(testFnDisabled)
                }

                const importText = importNames.join(', ')
                const lastSpecifierRange = node.specifiers.at(-1)?.range
                if (!lastSpecifierRange) return null

                return fixer.replaceTextRange(
                  [node.specifiers[0].range[0], lastSpecifierRange[1]],
                  importText,
                )
              }

              return fixer.replaceText(specifier, testFnDisabled)
            },
          })
        }
      },
      CallExpression(node: TSESTree.CallExpression) {
        if (
          node.callee.type === AST_NODE_TYPES.Identifier &&
          node.callee.name === 'bench'
        )
          return
        const vitestFnCall = parseVitestFnCall(node, context)

        if (!vitestFnCall) return

        if (vitestFnCall.type === 'describe') {
          describeNestingLevel++
          return
        }

        const funcNode =
          node.callee.type === AST_NODE_TYPES.TaggedTemplateExpression
            ? node.callee.tag
            : node.callee.type === AST_NODE_TYPES.CallExpression
              ? node.callee.callee
              : node.callee
        const writtenName = getWrittenName(vitestFnCall)
        const renamable = isRenamable(vitestFnCall)

        if (
          vitestFnCall.type === 'test' &&
          describeNestingLevel === 0 &&
          !writtenName.endsWith(testFnKeyWork)
        ) {
          const oppositeTestKeyword = getOppositeTestKeyword(testFnKeyWork)

          context.report({
            node: node.callee,
            data: { testFnKeyWork, oppositeTestKeyword },
            messageId: 'consistentMethod',
            fix: renamable
              ? buildFixer(funcNode, writtenName, testFnKeyWork)
              : undefined,
          })
        } else if (
          vitestFnCall.type === 'test' &&
          describeNestingLevel > 0 &&
          !writtenName.endsWith(testKeywordWithinDescribe)
        ) {
          const oppositeTestKeyword = getOppositeTestKeyword(
            testKeywordWithinDescribe,
          )

          context.report({
            messageId: 'consistentMethodWithinDescribe',
            node: node.callee,
            data: { testKeywordWithinDescribe, oppositeTestKeyword },
            fix: renamable
              ? buildFixer(funcNode, writtenName, testKeywordWithinDescribe)
              : undefined,
          })
        }
      },
      'CallExpression:exit'(node) {
        if (isTypeOfVitestFnCall(node, context, ['describe']))
          describeNestingLevel--
      },
    }
  },
})
