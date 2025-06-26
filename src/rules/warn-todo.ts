import { createEslintRule } from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'

export const RULE_NAME = 'warn-todo'

export default createEslintRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'disallow `.todo` usage',
      recommended: false,
    },
    messages: {
      warnTodo: 'The use of `.todo` is not recommended.',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (
          vitestFnCall?.type !== 'describe' &&
          vitestFnCall?.type !== 'test' &&
          vitestFnCall?.type !== 'it'
        )
          return

        const todoMember = vitestFnCall.members.find(
          (m) => m.type === 'Identifier' && m.name === 'todo',
        )

        if (!todoMember) return

        context.report({
          messageId: 'warnTodo',
          node: todoMember,
        })
      },
    }
  },
})
