import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { createEslintRule, isSupportedAccessor } from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'

const RULE_NAME = 'prefer-to-have-been-called-times'

export default createEslintRule({
  name: RULE_NAME,
  meta: {
    fixable: 'code',
    docs: {
      description: 'Suggest using `toHaveBeenCalledTimes()`',
    },
    messages: {
      preferMatcher: 'Prefer `toHaveBeenCalledTimes`',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (vitestFnCall?.type !== 'expect') {
          return
        }

        const { parent: expect } = vitestFnCall.head.node

        if (expect?.type !== AST_NODE_TYPES.CallExpression) {
          return
        }

        const { matcher } = vitestFnCall

        if (!isSupportedAccessor(matcher, 'toHaveLength')) {
          return
        }

        const [argument] = expect.arguments

        if (
          argument?.type !== AST_NODE_TYPES.MemberExpression ||
          !isSupportedAccessor(argument.property, 'calls')
        ) {
          return
        }

        const { object } = argument

        if (
          object.type !== AST_NODE_TYPES.MemberExpression ||
          !isSupportedAccessor(object.property, 'mock')
        ) {
          return
        }

        context.report({
          messageId: 'preferMatcher',
          node: matcher,
          fix(fixer) {
            return [
              fixer.removeRange([
                object.property.range[0] - 1,
                argument.range[1],
              ]),
              fixer.replaceTextRange(
                [matcher.parent.object.range[1], matcher.parent.range[1]],
                '.toHaveBeenCalledTimes',
              ),
            ]
          },
        })
      },
    }
  },
})
