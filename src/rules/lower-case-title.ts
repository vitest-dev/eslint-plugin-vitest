import { TSESLint } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'

export const RULE_NAME = 'lower-case-title'
export type MessageIds = 'lowerCaseTitle';
export type Options = [];

export default createEslintRule<Options, MessageIds>({
	name: RULE_NAME,
	meta: {
		type: 'problem',
		docs: {
			description: 'Enforce lowercase titles',
			recommended: 'strict'
		},
		fixable: 'code',
		schema: [],
		messages: {
			lowerCaseTitle: 'Title should be lowercase.'
		}
	},
	defaultOptions: [],
	create: (context) => {
		const reserved = ['it', 'describe', 'test']

		function isLowerCase(str) {
			return str === str.toLowerCase() && str !== str.toUpperCase()
		}

		// converting pascal case to lower case
		function toLowerCaseFromPascalCase(str: string) {
			return str
				.split(' ')
				.map(word => (word.match(/([A-Z])/g) && word.length > 3) ? word.replace(/([A-Z])/g, ' $1').toLowerCase() : word)
				.join(' ')
		}

		return {
			ExpressionStatement(node) {
				if (
					node.expression.type === 'CallExpression' &&
					node.expression.callee.type === 'Identifier'
				) {
					if (reserved.includes(node.expression.callee.name)) {
						const { arguments: args } = node.expression

						if (args[0].type === 'TemplateLiteral' &&
							typeof args[0].quasis[0].value.raw === 'string' &&
							!isLowerCase(args[0].quasis[0].value.raw)) {
							const value = args[0].quasis[0].value.raw

							context.report({
								node: node.expression.arguments[0],
								messageId: 'lowerCaseTitle',
								loc: args[0].loc,
								fix: (fixer) => {
									const newText = value.substring(0, 1).toLowerCase() + value.substring(1)

									return fixer.replaceTextRange(
										[args[0].range[0] + 1, args[0].range[1] - 1],
										toLowerCaseFromPascalCase(newText)
									)
								}
							})
						}

						if (
							args[0].type === 'Literal' &&
							typeof args[0].value === 'string' &&
							!isLowerCase(args[0].value)
						) {
							const { value, range } = args[0]

							context.report({
								node: node.expression.arguments[0],
								messageId: 'lowerCaseTitle',
								loc: node.loc,
								fix(fixer) {
									const rangeIgnoringQuotes: TSESLint.AST.Range = [
										range[0] + 1,
										range[1] - 1
									]

									const desc = value.substring(0, 1).toLowerCase() + value.substring(1)

									return fixer.replaceTextRange(rangeIgnoringQuotes, toLowerCaseFromPascalCase(desc))
								}
							})
						}
					}
				}
			}
		}
	}
})
