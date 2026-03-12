import { createEslintRule, getAccessorValue } from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'

export type MessageIds = 'noFocusedTests'
const RULE_NAME = 'no-focused-tests'
export type Options = [
  Partial<{
    fixable: boolean
  }>,
]

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

        if (isTestOrDescribe && onlyNode) {
          context.report({
            node: onlyNode,
            messageId: 'noFocusedTests',
            fix: (fixer) =>
              fixable
                ? fixer.removeRange([onlyNode.range[0] - 1, onlyNode.range[1]])
                : null,
          })
        }
      },
    }
  },
})
