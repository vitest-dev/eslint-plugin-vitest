import { TSESTree } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'

export const RULE_NAME = 'expect-expect'
export type MESSAGE_ID = 'expected-expect';

export default createEslintRule<[], MESSAGE_ID>({
	name: RULE_NAME,
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce having expectation in test body',
			recommended: 'warn'
		},
		fixable: 'code',
		schema: [],
		messages: {
			'expected-expect': 'Use \'expect\' in test body'
		}
	},
	defaultOptions: [],
	create: (context) => {
		return {
			'CallExpression[callee.name=/^(it|test)$/]'(
				node: TSESTree.CallExpression
			) {
				const { arguments: args } = node

				// TODO: Types this
				const hasExpect = args.some((arg: any) => {
					if (arg?.body?.body.length) {
						return arg.body.body.some((body) => {
							if (body?.expression?.callee?.object?.callee?.name === 'expect')
								return true
							else
								return false
						})
					}
					return false
				})

				if (!hasExpect) {
					context.report({
						node,
						messageId: 'expected-expect'
					})
				}
			}
		}
	}
})
