import { createEslintRule, getAccessorValue } from '../utils'
import {
  isTypeOfVitestFnCall,
  parseVitestFnCall,
} from '../utils/parse-vitest-fn-call'

const RULE_NAME = 'prefer-hooks-on-top'
type MessageIds = 'noHookOnTop'
type Options = []

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce having hooks before any test cases',
      recommended: false,
    },
    messages: {
      noHookOnTop: 'Hooks should come before test cases',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const hooksContext = [false]
    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        const hasExemptModifier = vitestFnCall?.members?.some((member) =>
          ['extend', 'scoped'].includes(getAccessorValue(member)),
        )

        if (
          vitestFnCall?.type &&
          ['test', 'it'].includes(vitestFnCall.type) &&
          !hasExemptModifier
        )
          hooksContext[hooksContext.length - 1] = true

        if (
          hooksContext[hooksContext.length - 1] &&
          isTypeOfVitestFnCall(node, context, ['hook'])
        ) {
          context.report({
            messageId: 'noHookOnTop',
            node,
          })
        }

        hooksContext.push(false)
      },
      'CallExpression:exit'() {
        hooksContext.pop()
      },
    }
  },
})
