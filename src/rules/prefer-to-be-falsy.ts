import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getAccessorValue } from '../utils'
import { getFirstMatcherArg, parseVitestFnCall } from '../utils/parse-vitest-fn-call'
import { EqualityMatcher } from '../utils/types'

export type MESSAGE_IDS = 'preferToBeFalsy'
export const RULE_NAME = 'prefer-to-be-falsy'
type Options = []

interface FalseLiteral extends TSESTree.BooleanLiteral {
  value: false
}

const isFalseLiteral = (node: TSESTree.Node): node is FalseLiteral =>
  node.type === AST_NODE_TYPES.Literal && node.value === false

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce using toBeFalsy()',
      recommended: 'strict'
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferToBeFalsy: 'Prefer using toBeFalsy()'
    }
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (!(vitestFnCall?.type === 'expect' || vitestFnCall?.type === 'expectTypeOf')) return

        if (vitestFnCall.args.length === 1
          && isFalseLiteral(getFirstMatcherArg(vitestFnCall))
        // eslint-disable-next-line no-prototype-builtins
          && EqualityMatcher.hasOwnProperty(getAccessorValue(vitestFnCall.matcher))) {
          context.report({
            node: vitestFnCall.matcher,
            messageId: 'preferToBeFalsy',
            fix: fixer => [
              fixer.replaceText(vitestFnCall.matcher, 'toBeFalsy'),
              fixer.remove(vitestFnCall.args[0])
            ]
          })
        }
      }
    }
  }
})
