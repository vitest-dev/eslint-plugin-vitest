import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getAccessorValue } from '../utils/index'
import { getFirstMatcherArg, parseVitestFnCall } from '../utils/parseVitestFnCall'
import { EqualityMatcher } from '../utils/types'

export const RULE_NAME = 'prefer-to-be-false'
export type MESSAGE_ID = 'preferToBeFalse';
export type Options = []

interface FalseLiteral extends TSESTree.BooleanLiteral {
	value: false;
}

const isFalseLiteral = (node: TSESTree.Node): node is FalseLiteral => node.type === AST_NODE_TYPES.Literal && node.value === false

export default createEslintRule<Options, MESSAGE_ID>({
	name: RULE_NAME,
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Suggest using toBeFalsy()',
			recommended: false
		},
		messages: {
			preferToBeFalse: 'Prefer toBe(false) over toBeFalsy()'
		},
		fixable: 'code',
		schema: []
	},
	defaultOptions: [],
	create(context) {
		return {
			CallExpression(node) {
				const vitestFnCall = parseVitestFnCall(node, context)

				if (vitestFnCall?.type !== 'expect') return

				if (vitestFnCall.args.length === 1 &&
					isFalseLiteral(getFirstMatcherArg(vitestFnCall)) &&
					// eslint-disable-next-line no-prototype-builtins
					EqualityMatcher.hasOwnProperty(getAccessorValue(vitestFnCall.matcher))) {
					context.report({
						node: vitestFnCall.matcher,
						messageId: 'preferToBeFalse',
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
