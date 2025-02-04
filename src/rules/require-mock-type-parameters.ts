import { createEslintRule } from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'

type MESSAGE_IDS = 'noTypeParameter'
export const RULE_NAME = 'require-mock-type-parameters'
type Options = []

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce using type parameters with vitest mock functions',
      recommended: false
    },
    messages: {
      noTypeParameter: 'Missing type parameters'
    },
    fixable: 'code',
    schema: []
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)
        if (vitestFnCall?.type !== 'vi') return

        for (const member of vitestFnCall?.members) {
          if (!('name' in member) || member.name !== 'fn' || node.typeArguments !== undefined) continue
          context.report({
            node: member,
            messageId: 'noTypeParameter'
          })
        }
      }
    }
  }
})
