// Got inspirations from https://github.com/shokai/eslint-plugin-if-in-test

import { TSESTree } from '@typescript-eslint/utils/dist/ts-estree'
import { createEslintRule } from '../utils'

export const RULE_NAME = 'no-conditional-tests'
export type MESSAGE_ID = 'noConditionalTests'

export default createEslintRule<[], MESSAGE_ID>({
	name: RULE_NAME,
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow conditional tests',
			recommended: false
		},
		schema: [],
		messages: {
			noConditionalTests: 'Avoid using conditionals in a test.'
		}
	},
	defaultOptions: [],
	create(context) {
		let isInTestBlock = false

		function checkIfItsUnderTestOrItBlock(node: TSESTree.Node) {
			if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && (node.callee.name === 'it' || node.callee.name === 'test'))
				return true
		}

		function reportConditional(node: TSESTree.Node) {
			if (isInTestBlock) {
				context.report({
					node,
					messageId: 'noConditionalTests'
				})
			}
		}

		return {
			CallExpression: function (node: TSESTree.CallExpression) {
				if (checkIfItsUnderTestOrItBlock(node))
					isInTestBlock = true
			},
			'CallExpression:exit': function (node: TSESTree.CallExpression) {
				if (checkIfItsUnderTestOrItBlock(node))
					isInTestBlock = false
			},
			IfStatement: reportConditional,
			SwitchStatement: reportConditional,
			LogicalExpression: reportConditional,
			ConditionalExpression: reportConditional
		}
	}
})
