import { TSESTree } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'

export const RULE_NAME = 'no-commented-out-tests'
export type MESSAGE_IDS = 'noCommentedOutTests';
export type Options = [];

function hasTests(node: TSESTree.Comment) {
	return /^\s*[xf]?(test|it|describe)(\.\w+|\[['"]\w+['"]\])?\s*\(/mu.test(node.value)
}

export default createEslintRule<Options, MESSAGE_IDS>({
	name: RULE_NAME,
	meta: {
		docs: {
			description: 'Disallow commented out tests',
			requiresTypeChecking: false,
			recommended: 'warn'
		},
		messages: {
			noCommentedOutTests: 'Remove commented out tests. You may want to use `skip` or `only` instead.'
		},
		schema: [],
		type: 'suggestion'
	},
	defaultOptions: [],
	create(context) {
		const sourceCode = context.getSourceCode()

		function checkNodeForCommentedOutTests(node: TSESTree.Comment) {
			if (!hasTests(node))
				return
			context.report({ messageId: 'noCommentedOutTests', node })
		}

		return {
			Program() {
				const comments = sourceCode.getAllComments()
				comments.forEach(checkNodeForCommentedOutTests)
			}
		}
	}
})
