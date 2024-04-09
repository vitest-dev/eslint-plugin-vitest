import { createEslintRule } from '../utils'
import { isTypeOfVitestFnCall, parseVitestFnCall } from '../utils/parse-vitest-fn-call'

export const RULE_NAME = 'no-duplicate-hooks'
export type MESSAGE_IDS = 'noDuplicateHooks'
export type Options = []

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    docs: {
      recommended: 'strict',
      description: 'disallow duplicate hooks and teardown hooks',
      requiresTypeChecking: false
    },
    messages: {
      noDuplicateHooks: 'Duplicate {{hook}} in describe block.'
    },
    schema: [],
    type: 'suggestion'
  },
  defaultOptions: [],
  create(context) {
    const hooksContexts: Array<Record<string, number>> = [{}]

    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (vitestFnCall?.type === 'describe')
          hooksContexts.push({})

        if (vitestFnCall?.type !== 'hook')
          return

        const currentLayer = hooksContexts[hooksContexts.length - 1]

        currentLayer[vitestFnCall.name] ||= 0
        currentLayer[vitestFnCall.name] += 1

        if (currentLayer[vitestFnCall.name] > 1) {
          context.report({
            messageId: 'noDuplicateHooks',
            data: { hook: vitestFnCall.name },
            node
          })
        }
      },
      'CallExpression:exit'(node) {
        if (isTypeOfVitestFnCall(node, context, ['describe']))
          hooksContexts.pop()
      }
    }
  }
})
