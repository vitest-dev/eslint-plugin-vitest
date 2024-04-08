import { createEslintRule } from '../utils'
import { isTypeOfVitestFnCall } from '../utils/parse-vitest-fn-call'

export const RULE_NAME = 'prefer-hooks-on-top'
type MessageIds = 'noHookOnTop'
type Options = []

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce having hooks before any test cases',
      recommended: 'strict'
    },
    messages: {
      noHookOnTop: 'Hooks should come before test cases'
    },
    schema: []
  },
  defaultOptions: [],
  create(context) {
    const hooksContext = [false]
    return {
      CallExpression(node) {
        if (isTypeOfVitestFnCall(node, context, ['test']))
          hooksContext[hooksContext.length - 1] = true

        if (hooksContext[hooksContext.length - 1] && isTypeOfVitestFnCall(node, context, ['hook'])) {
          context.report({
            messageId: 'noHookOnTop',
            node
          })
        }

        hooksContext.push(false)
      },
      'CallExpression:exit'() {
        hooksContext.pop()
      }
    }
  }
})
