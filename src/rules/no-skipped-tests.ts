import { createEslintRule } from '../utils'

export type MessageIds = 'noSkippedTests';
export const RULE_NAME = 'no-skipped-tests'
export type Options = [];

export default createEslintRule<Options, MessageIds>({
	name: RULE_NAME,
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow skipped tests',
			recommended: 'error'
		},
		schema: [],
		messages: {
			noSkippedTests: 'Skipped tests are not allowed.'
		}
	},
	defaultOptions: [],
	create: (context) => {
		return {
			ExpressionStatement(node) {
				if (node.expression.type === 'CallExpression') {
					const { callee } = node.expression
					if (
						callee.type === 'MemberExpression' &&
            callee.object.type === 'Identifier' &&
            (callee.object.name === 'it' ||
              callee.object.name === 'describe') &&
            callee.property.type === 'Identifier' &&
            callee.property.name === 'skip'
					) {
						context.report({
							node,
							messageId: 'noSkippedTests'
							// TODO: make this fix work
							// fix: (fixer) => {
							//	return fixer.removeRange([node.range[0], args[0].range[1]]);
							// }
						})
					}
				}
			}
		}
	}
})
