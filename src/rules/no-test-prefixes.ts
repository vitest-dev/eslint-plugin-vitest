import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { createEslintRule, getAccessorValue } from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'

export const RULE_NAME = 'no-test-prefixes'
export type MESSAGE_IDS = 'usePreferredName'
export type Options = []

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        'Disallow using the `f` and `x` prefixes in favour of `.only` and `.skip`',
      recommended: false,
    },
    type: 'suggestion',
    messages: {
      usePreferredName: 'Use "{{ preferredNodeName }}" instead',
    },
    fixable: 'code',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (vitestFnCall?.type !== 'describe' && vitestFnCall?.type !== 'test')
          return

        if (vitestFnCall.name[0] !== 'f' && vitestFnCall.name[0] !== 'x') return

        const preferredNodeName = [
          vitestFnCall.name.slice(1),
          vitestFnCall.name[0] === 'f' ? 'only' : 'skip',
          ...vitestFnCall.members.map((m) => getAccessorValue(m)),
        ].join('.')

        const funcNode =
          node.callee.type === AST_NODE_TYPES.TaggedTemplateExpression
            ? node.callee.tag
            : node.callee.type === AST_NODE_TYPES.CallExpression
              ? node.callee.callee
              : node.callee

        context.report({
          messageId: 'usePreferredName',
          node: node.callee,
          data: { preferredNodeName },
          fix: (fixer) => [fixer.replaceText(funcNode, preferredNodeName)],
        })
      },
    }
  },
})
