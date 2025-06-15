import { createEslintRule, getAccessorValue } from '../utils'
import { parseVitestFnCall, resolveScope } from '../utils/parse-vitest-fn-call'
import { getScope } from '../utils/scope'

export const RULE_NAME = 'no-disabled-tests'
export type MESSAGE_ID =
  | 'missingFunction'
  | 'pending'
  | 'pendingSuite'
  | 'pendingTest'
  | 'disabledSuite'
  | 'disabledTest'
export type Options = []

export default createEslintRule<Options, MESSAGE_ID>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow disabled tests',
      recommended: false,
    },
    messages: {
      missingFunction: 'Test is missing function argument',
      pending: 'Call to pending()',
      pendingSuite: 'Call to pending() within test suite',
      pendingTest: 'Call to pending() within test',
      disabledSuite:
        'Disabled test suite - if you want to skip a test suite temporarily, use .todo() instead',
      disabledTest:
        'Disabled test - if you want to skip a test temporarily, use .todo() instead',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    let suiteDepth = 0
    let testDepth = 0

    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (!vitestFnCall) return

        if (vitestFnCall.type === 'describe') suiteDepth++

        if (vitestFnCall.type === 'test') {
          testDepth++

          if (
            node.arguments.length < 2 &&
            vitestFnCall.members.every((s) => getAccessorValue(s) === 'skip')
          ) {
            context.report({
              messageId: 'missingFunction',
              node,
            })
          }
        }

        const skipMember = vitestFnCall.members.find(
          (s) => getAccessorValue(s) === 'skip',
        )
        if (vitestFnCall.name.startsWith('x') || skipMember !== undefined) {
          context.report({
            messageId:
              vitestFnCall.type === 'describe'
                ? 'disabledSuite'
                : 'disabledTest',
            node: skipMember ?? vitestFnCall.head.node,
          })
        }
      },
      'CallExpression:exit'(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (!vitestFnCall) return

        if (vitestFnCall.type === 'describe') suiteDepth--

        if (vitestFnCall.type === 'test') testDepth--
      },
      'CallExpression[callee.name="pending"]'(node) {
        const scope = getScope(context, node)

        if (resolveScope(scope, 'pending')) return

        if (testDepth > 0) context.report({ messageId: 'pendingTest', node })
        else if (suiteDepth > 0)
          context.report({ messageId: 'pendingSuite', node })
        else context.report({ messageId: 'pending', node })
      },
    }
  },
})
