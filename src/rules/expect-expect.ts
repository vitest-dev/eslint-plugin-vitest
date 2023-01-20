import { createEslintRule, getNodeName } from '../utils'

export const RULE_NAME = 'expect-expect'
export type MESSAGE_ID = 'expectedExpect';

export default createEslintRule<[], MESSAGE_ID>({
	name: RULE_NAME,
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce having expectation in test body',
			recommended: 'strict'
		},
		schema: [],
		messages: {
			expectedExpect: 'Use \'expect\' in test body'
		}
	},
	defaultOptions: [],
	create: (context) => {
		const hasExpect = 0
		return {
			CallExpression(node) {
				const name = getNodeName(node) ?? ''
			},
			'Program:exit'(node) {
				if (!hasExpect) {
					context.report({
						node,
						messageId: 'expectedExpect'
					})
				}
			}
		}
	}
})
