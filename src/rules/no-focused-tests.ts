import { TSESLint, TSESTree } from '@typescript-eslint/utils'
import {
  createEslintRule,
  findVitestModeProperty,
  getAccessorValue,
} from '../utils'
import {
  KnownMemberExpressionProperty,
  parseVitestFnCall,
} from '../utils/parse-vitest-fn-call'

export type MessageIds = 'noFocusedTests'
const RULE_NAME = 'no-focused-tests'
export type Options = [
  Partial<{
    fixable: boolean
  }>,
]

const isMemberAccessToken = (token: TSESTree.Token) =>
  token.type === 'Punctuator' && ['.', '?.', '['].includes(token.value)

/**
 * Removes the `.only`, `?.only` or `["only"]` access, keeping the object it
 * is accessed on.
 */
const removeMemberAccess = (
  fixer: TSESLint.RuleFixer,
  sourceCode: Readonly<TSESLint.SourceCode>,
  property: KnownMemberExpressionProperty,
) => {
  const memberExpression = property.parent
  const accessToken = sourceCode.getTokenAfter(
    memberExpression.object,
    isMemberAccessToken,
  )

  if (!accessToken) return null

  return fixer.removeRange([accessToken.range[0], memberExpression.range[1]])
}

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow focused tests',
      recommended: false,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          fixable: {
            description: 'Whether the rule should provide an autofix.',
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noFocusedTests: 'Focused tests are not allowed',
    },
    defaultOptions: [{ fixable: true }],
  },
  create: (context, options) => {
    const fixable = options[0].fixable!

    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (!vitestFnCall) {
          return
        }

        const isTestOrDescribe = ['it', 'test', 'describe'].includes(
          vitestFnCall.name,
        )

        const onlyNode = vitestFnCall.members.find(
          (m) => getAccessorValue(m) === 'only',
        )

        const onlyProperty = findVitestModeProperty(node, 'only')
        const focusedNode = onlyNode ?? onlyProperty?.key

        if (isTestOrDescribe && focusedNode) {
          context.report({
            node: focusedNode,
            messageId: 'noFocusedTests',
            fix: (fixer) => {
              if (!fixable) return null

              if (onlyNode)
                return removeMemberAccess(fixer, context.sourceCode, onlyNode)

              if (onlyProperty)
                return fixer.replaceText(onlyProperty.value, 'false')

              return null
            },
          })
        }
      },
    }
  },
})
