import { TSESTree } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'
import { isTypeOfVitestFnCall } from '../utils/parse-vitest-fn-call'

export const RULE_NAME = 'no-conditional-in-test'
export type MESSAGE_IDS = 'noConditionalInTest';
export type Options = [];

export default createEslintRule<Options, MESSAGE_IDS>({
	name: RULE_NAME,
	meta: {
		docs: {
			description: 'Disallow conditional tests',
			requiresTypeChecking: false,
			recommended: 'warn'
		},
		messages: {
			noConditionalInTest: 'Remove conditional tests'
		},
		schema: [],
		type: 'problem'
	},
	defaultOptions: [],
	create(context) {
		let inTestCase = false

		const reportCondional = (node: TSESTree.Node) => {
			if (inTestCase)
				context.report({ messageId: 'noConditionalInTest', node })
		}

		return {
			CallExpression(node) {
				if (isTypeOfVitestFnCall(node, context, ['test']))
					inTestCase = true
			},
			'CallExpression:exit'(node) {
				if (isTypeOfVitestFnCall(node, context, ['test']))
					inTestCase = false
			},
			IfStatement: reportCondional,
			SwitchStatement: reportCondional,
			ConditionalExpression: reportCondional,
			LogicalExpression: reportCondional
		}
	}
})
