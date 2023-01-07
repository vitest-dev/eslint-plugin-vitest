import { createEslintRule } from '../utils'

export const RULE_NAME = 'max-nested-describe'
export type MESSAGE_ID = 'maxNestedDescribe';
export type Options = [
	{
		max: number;
	}
];

export default createEslintRule<Options, MESSAGE_ID>({
	name: RULE_NAME,
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow nested describes',
			recommended: 'error'
		},
		fixable: 'code',
		schema: [
			{
				type: 'object',
				properties: {
					max: {
						type: 'number'
					}
				},
				additionalProperties: false
			}
		],
		messages: {
			maxNestedDescribe: 'Nested describes are not allowed.'
		}
	},
	defaultOptions: [
		{
			max: 5
		}
	],
	create(context, [{ max }]) {
		const stack = []
		return {
			'CallExpression[callee.name=\'describe\']'(node) {
				if (stack.length >= max) {
					context.report({
						node,
						messageId: 'maxNestedDescribe'
					})
				}
				stack.push(node)
			}
		}
	}
})
