import { createEslintRule } from '../utils/index'
import { isTypeOfVitestFnCall, parseVitestFnCall } from '../utils/parse-vitest-fn-call'

export const RULE_NAME = 'prefer-hooks-in-order'
type MESSAGE_IDS = 'reorderHooks'
type Options = []

const HooksOrder = ['beforeAll', 'beforeEach', 'afterEach', 'afterAll']

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce having hooks in consistent order',
      recommended: 'strict'
    },
    messages: {
      reorderHooks: '`{{ currentHook }}` hooks should be before any `{{ previousHook }}` hooks'
    },
    schema: []
  },
  defaultOptions: [],
  create(context) {
    let previousHookIndex = -1
    let inHook = false

    return {
      CallExpression(node) {
        if (inHook) return

        const vitestFnCall = parseVitestFnCall(node, context)

        if (vitestFnCall?.type !== 'hook') {
          previousHookIndex = -1
          return
        }

        inHook = true
        const currentHook = vitestFnCall.name
        const currentHookIndex = HooksOrder.indexOf(currentHook)

        if (currentHookIndex < previousHookIndex) {
          context.report({
            messageId: 'reorderHooks',
            data: {
              previousHook: HooksOrder[previousHookIndex],
              currentHook
            },
            node
          })
          inHook = false
          return
        }

        previousHookIndex = currentHookIndex
      },
      'CallExpression:exit'(node) {
        if (isTypeOfVitestFnCall(node, context, ['hook'])) {
          inHook = false
          return
        }

        if (inHook)
          return

        previousHookIndex = -1
      }
    }
  }
})
