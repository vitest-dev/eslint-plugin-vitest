import { TSESTree } from '@typescript-eslint/utils'
import { SourceCode } from '@typescript-eslint/utils/dist/ts-eslint'
import { createEslintRule } from '../utils'

export const RULE_NAME = 'no-commented-out-tests'
export type MESSAGE_IDS = 'noCommentedOutTests' | 'addSkip'
export type Options = []

const TEST_RE = /^\s*([xf]?(test|it|describe)(\.\w+|\[['"]\w+['"]\])?)\s*\(/mu

function hasTests(node: TSESTree.Comment) {
	return TEST_RE.test(node.value)
}

function getCommentedTestCallRange(sourceCode: Readonly<SourceCode>, node: TSESTree.Comment) {
	if (!hasTests(node))
		return null
	const match = node.value.match(TEST_RE)
	if (!match)
		return null
	const testCall = match[2]
	const offset = node.value.indexOf(testCall) - 1
	const valueStart = sourceCode.getText(node).indexOf(node.value)
	const commentMarkEnd = node.range[0] + valueStart + 1
	const start = commentMarkEnd + offset
	const end = start + testCall.length
	return {
		range: [start, end] as const,
		commentMarkEnd
	}
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
			noCommentedOutTests: 'Remove commented out tests',
			addSkip: 'Add skip to commented out tests'
		},
		schema: [],
		type: 'suggestion',
		hasSuggestions: true
	},
	defaultOptions: [],
	create(context) {
		const sourceCode = context.getSourceCode()

		function checkNodeForCommentedOutTests(node: TSESTree.Comment) {
			const result = getCommentedTestCallRange(sourceCode, node)
			if (!result)
				return

			const { range, commentMarkEnd } = result

			context.report({
				messageId: 'noCommentedOutTests',
				node,
				suggest: [
					{
						messageId: 'addSkip',
						* fix(fixer) {
							yield fixer.insertTextAfterRange(range, '.skip')
							yield fixer.removeRange([node.range[0], commentMarkEnd])
						}
					}
				]
			})
		}

		return {
			Program() {
				const comments = sourceCode.getAllComments()
				comments.forEach(checkNodeForCommentedOutTests)
			}
		}
	}
})
