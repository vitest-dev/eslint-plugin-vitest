import { createEslintRule, getAccessorValue } from '../utils'
import {
  getFirstMatcherArg,
  parseVitestFnCall,
} from '../utils/parse-vitest-fn-call'
import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'

const RULE_NAME = 'prefer-called-once'
type MESSAGE_IDS = 'preferCalledOnce'
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
        'enforce using `toBeCalledOnce()` or `toHaveBeenCalledOnce()`',
      recommended: false,
    },
    messages: {
      preferCalledOnce: 'Prefer {{ replacedMatcherName }}()',
    },
    type: 'suggestion',
    fixable: 'code',
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (vitestFnCall?.type !== 'expect') return

        const { matcher } = vitestFnCall
        const matcherName = getAccessorValue(matcher)

        if (
          ['toBeCalledTimes', 'toHaveBeenCalledTimes'].includes(matcherName) &&
          vitestFnCall.args.length === 1 &&
          isOneLiteral(getFirstMatcherArg(vitestFnCall))
        ) {
          const replacedMatcherName = matcherName.replace('Times', 'Once')

          context.report({
            data: { replacedMatcherName },
            messageId: 'preferCalledOnce',
            node: matcher,
            fix: (fixer) => [
              fixer.replaceText(matcher, replacedMatcherName),
              fixer.remove(vitestFnCall.args[0]),
            ],
          })
        }
      },
    }
  },
})
