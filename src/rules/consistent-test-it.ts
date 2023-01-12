import { TSESTree } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'

export const RULE_NAME = 'consistent-test-it'
export type MessageIds = 'consistentTestIt';

export default createEslintRule<
	[
		Partial<{
			fn: 'it' | 'test';
		}>
	],
	MessageIds
>({
	name: RULE_NAME,
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Prefer test or it but not both',
			recommended: 'strict'
		},
		messages: {
			consistentTestIt: 'Prefer test or it but not both at the same time'
		},
		schema: [
			{
				type: 'object',
				properties: {
					fn: {
						enum: ['test', 'it']
					}
				},
				additionalProperties: false
			}
		]
	},
	defaultOptions: [
		{
			fn: 'test'
		}
	],
	create(context) {
		const options = context.options[0]
		return {
			'CallExpression[callee.name=/^(it|test)$/]'(node: TSESTree.CallExpression) {
				const { name } = node.callee as TSESTree.Identifier
				const { parent } = node
				if (parent && parent.type === 'MemberExpression') {
					const { object, property } = parent
					if (
						object.type === 'Identifier' &&
						object.name === 'describe' &&
						property.type === 'Identifier' &&
						property.name === 'each'
					)
						return
				}
				if (options.fn === name)
					return

				context.report({
					node,
					messageId: 'consistentTestIt'
				})
			}
		}
	}
})
