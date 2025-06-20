import { createEslintRule, getAccessorValue } from '../utils'
import {
  getFirstMatcherArg,
  parseVitestFnCall,
} from '../utils/parse-vitest-fn-call'
import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'

export const RULE_NAME = 'prefer-called-times'
type MESSAGE_IDS = 'preferCalledTimes'
type Options = []

type OneLiteral = TSESTree.Literal & {
  value: 1
}

const isOneLiteral = (node: TSESTree.Node): node is OneLiteral =>
  node.type === AST_NODE_TYPES.Literal && node.value === 1

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        'enforce using `toBeCalledTimes(1)` or `toHaveBeenCalledTimes(1)`',
      recommended: false,
    },
    messages: {
      preferCalledTimes: 'Prefer {{ replacedMatcherName }}(1)',
    },
    type: 'suggestion',
    fixable: 'code',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (vitestFnCall?.type !== 'expect') return

        const { matcher } = vitestFnCall
        const matcherName = getAccessorValue(matcher)

        if (['toBeCalledOnce', 'toHaveBeenCalledOnce'].includes(matcherName)) {
          const replacedMatcherName = matcherName.replace('Once', 'Times')

          context.report({
            data: { replacedMatcherName },
            messageId: 'preferCalledTimes',
            node: matcher,
            fix: (fixer) => [
              fixer.replaceText(matcher, replacedMatcherName),
              fixer.insertTextAfterRange(
                  [
                    vitestFnCall.matcher.range[0],
                    vitestFnCall.matcher.range[1] + 1,
                  ],
                  '1',
              ),
            ],
          })
        }
      },
    }
  },
})
