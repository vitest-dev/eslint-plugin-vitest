import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getNodeName, isSupportedAccessor } from '../utils'
import { parsePluginSettings } from '../utils/parse-plugin-settings'
import {
  getTestCallExpressionsFromDeclaredVariables,
  isTypeOfVitestFnCall,
} from '../utils/parse-vitest-fn-call'

export const RULE_NAME = 'expect-expect'
export type MESSAGE_ID = 'noAssertions'
type Options = [
  {
    assertFunctionNames: string[]
    additionalTestBlockFunctions: string[]
  },
]

export default createEslintRule<Options, MESSAGE_ID>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce having expectation in test body',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          assertFunctionNames: {
            type: 'array',
            items: { type: 'string' },
          },
          additionalTestBlockFunctions: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noAssertions: 'Test has no assertions',
    },
  },
  defaultOptions: [
    {
      assertFunctionNames: ['expect', 'assert'],
      additionalTestBlockFunctions: [],
    },
  ],
  create(
    context,
    [{ assertFunctionNames = ['expect'], additionalTestBlockFunctions = [] }],
  ) {
    const unchecked: TSESTree.CallExpression[] = []
    const settings = parsePluginSettings(context.settings)

    if (settings.typecheck)
      assertFunctionNames.push('expectTypeOf', 'assertType')
    const assertFunctionRegexps = assertFunctionNames.map(buildPatternRegexp)

    function checkCallExpression(nodes: TSESTree.Node[]) {
      for (const node of nodes) {
        const index =
          node.type === AST_NODE_TYPES.CallExpression
            ? unchecked.indexOf(node)
            : -1

        if (node.type === AST_NODE_TYPES.FunctionDeclaration) {
          const declaredVariables =
            context.sourceCode.getDeclaredVariables(node)
          const testCallExpressions =
            getTestCallExpressionsFromDeclaredVariables(
              declaredVariables,
              context,
            )

          checkCallExpression(testCallExpressions)
        }

        if (index !== -1) {
          unchecked.splice(index, 1)
          break
        }
      }
    }

    return {
      CallExpression(node) {
        if (
          node.callee.type === AST_NODE_TYPES.Identifier &&
          node.callee.name === 'bench'
        )
          return

        if (
          node?.callee?.type === AST_NODE_TYPES.MemberExpression &&
          node.callee.property.type === AST_NODE_TYPES.Identifier &&
          node.callee.property.name === 'extend'
        )
          return

        if (
          node?.callee?.type === AST_NODE_TYPES.MemberExpression &&
          node.callee.property.type === AST_NODE_TYPES.Identifier &&
          node.callee.property.name === 'skip'
        )
          return

        const name = getNodeName(node) ?? ''

        if (
          isTypeOfVitestFnCall(node, context, ['test']) ||
          additionalTestBlockFunctions.includes(name)
        ) {
          if (
            node.callee.type === AST_NODE_TYPES.MemberExpression &&
            isSupportedAccessor(node.callee.property, 'todo')
          )
            return

          unchecked.push(node)
        } else if (assertFunctionRegexps.some((p) => p.test(name))) {
          checkCallExpression(context.sourceCode.getAncestors(node))
        }
      },
      'Program:exit'() {
        unchecked.forEach((node) => {
          context.report({
            node: node.callee,
            messageId: 'noAssertions',
          })
        })
      },
    }
  },
})

function buildPatternRegexp(pattern: string): RegExp {
  const parts = pattern.split('.').map((x) => {
    if (x === '**') return '[_a-z\\d\\.]*'

    return x.replace(/\*/gu, '[a-z\\d]*')
  })

  return new RegExp(`^${parts.join('\\.')}(\\.|$)`, 'ui')
}
