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
			recommended: 'error'
		},
		fixable: 'code',
		schema: [],
		messages: {
			noConditionalTests: 'Conditional tests are not allowed.'
		}
	},
	defaultOptions: [],
	create(context) {
		function checkConditionalTest(node: TSESTree.CallExpression) {
			const expression = node.arguments[1]

			if (!('body' in expression) || !('body' in expression.body) || !Array.isArray(expression.body.body))
				return

			if (expression.body.body.some((n) => n.type === 'IfStatement')) {
				context.report({
					node,
					messageId: 'noConditionalTests'
				})
			}

			// check to make sure there is no if statement in the test

			/// / check if there is ternary operator in the test
			// if (expression.body.body.some((n) => n.type === 'ExpressionStatement' && n.expression.type === 'CallExpression')) {
			//	context.report({
			//		node,
			//		messageId: 'noConditionalTests'
			//	})
			// }

			/// / check if there is a switch statement in the test
			// if (expression.body.body.some((n) => n.type === 'SwitchStatement')) {
			//	context.report({
			//		node,
			//		messageId: 'noConditionalTests'
			//	})
			// }
		}

		let describeCount = 0

		return {
			CallExpression: function (node: TSESTree.CallExpression) {
				if ((node.callee.type === 'Identifier' && node.callee.name === 'describe') || (node.callee.type === 'Identifier' && node.callee.name === 'it') || (node.callee.type === 'Identifier' && node.callee.name === 'test'))
					describeCount++
			},
			'CallExpression:exit': function (node: TSESTree.CallExpression) {
				if ((node.callee.type === 'Identifier' && node.callee.name === 'describe') || (node.callee.type === 'Identifier' && node.callee.name === 'it') || (node.callee.type === 'Identifier' && node.callee.name === 'test'))
					describeCount--
			},
			IfStatement: function (node: TSESTree.IfStatement) {
				if (describeCount < 1) return
				if (node.test.type !== 'SequenceExpression') return

				context.report({
					node,
					messageId: 'noConditionalTests'
				})
			},
			SwitchStatement: function (node: TSESTree.SwitchStatement) {
				console.log({ describeCount })
				if (describeCount < 1) return
				context.report({
					node,
					messageId: 'noConditionalTests'
				})
			}
		}
	}
})
