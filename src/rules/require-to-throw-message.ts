import { createEslintRule, getAccessorValue } from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'

export const RULE_NAME = 'require-to-throw-message'
type MESSAGE_IDS = 'addErrorMessage'
type Options = []

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require toThrow() to be called with an error message',
      recommended: false,
    },
    schema: [],
    messages: {
      addErrorMessage: 'Add an error message to {{ matcherName }}()',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (vitestFnCall?.type !== 'expect') return

        const { matcher } = vitestFnCall
        const matcherName = getAccessorValue(matcher)

        if (
          vitestFnCall.args.length === 0 &&
          ['toThrow', 'toThrowError'].includes(matcherName) &&
          !vitestFnCall.modifiers.some((nod) => getAccessorValue(nod) === 'not')
        ) {
          context.report({
            messageId: 'addErrorMessage',
            data: { matcherName },
            node: matcher,
          })
        }
      },
    }
  },
})
