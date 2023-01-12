import { TSESTree } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'

export const RULE_NAME = 'prefer-to-be'

export type MessageIds = 'preferToBe'

export default createEslintRule<[], MessageIds>({
	name: RULE_NAME,
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Suggest using toBe()',
			recommended: 'strict'
		},
		schema: [],
		messages: {
			preferToBe: 'Prefer toBe() instead'
		}
	},
	defaultOptions: [],
	create(context) {
		return {
			/**
			* This rule triggers a warning if `toEqual()` or `toStrictEqual()` are used to
			* assert a primitive literal value such as numbers, strings, and booleans.
			 */
			'CallExpression[callee.name=/^(toEqual|toStrictEqual)$/]'(node: TSESTree.CallExpression) {
				const { arguments: args } = node
				if (args.length === 1) {
					const arg = args[0]
					if (arg.type !== 'Literal') {
						context.report({
							node,
							messageId: 'preferToBe'
						})
					}
				}
			}
		}
	}
})
