import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getAccessorValue } from '../utils'
import {
  getFirstMatcherArg,
  parseVitestFnCall,
} from '../utils/parse-vitest-fn-call'
import { EqualityMatcher } from '../utils/types'

type MESSAGE_IDS = 'preferToBeTruthy'
export const RULE_NAME = 'prefer-to-be-truthy'
type Options = []

interface TrueLiteral extends TSESTree.BooleanLiteral {
  value: true
}

const isTrueLiteral = (node: TSESTree.Node): node is TrueLiteral =>
  node.type === AST_NODE_TYPES.Literal && node.value === true

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce using `toBeTruthy`',
      recommended: false,
    },
    messages: {
      preferToBeTruthy: 'Prefer using `toBeTruthy` to test value is `true`',
    },
    fixable: 'code',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (
          !(
            vitestFnCall?.type === 'expect' ||
            vitestFnCall?.type === 'expectTypeOf'
          )
        )
          return

        if (
          vitestFnCall.args.length === 1 &&
          isTrueLiteral(getFirstMatcherArg(vitestFnCall)) &&
          Object.prototype.hasOwnProperty.call(
            EqualityMatcher,
            getAccessorValue(vitestFnCall.matcher),
          )
        ) {
          context.report({
            node: vitestFnCall.matcher,
            messageId: 'preferToBeTruthy',
            fix: (fixer) => [
              fixer.replaceText(vitestFnCall.matcher, 'toBeTruthy'),
              fixer.remove(vitestFnCall.args[0]),
            ],
          })
        }
      },
    }
  },
})
