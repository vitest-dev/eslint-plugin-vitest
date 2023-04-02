import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getAccessorValue, isFunction } from '../utils'
import { parseVitestFnCall } from '../utils/parseVitestFnCall'

export const RULE_NAME = 'valid-expect-in-promise'
type MESSAGE_IDS = 'expectInFloatingPromise'
type Options = []

const isTestCaseCallWithCallbackArg = (node: TSESTree.CallExpression, context: TSESLint.RuleContext<string, Options>): boolean => {
	const vitesCallFn = parseVitestFnCall(node, context)

	if (vitesCallFn?.type !== 'test')
		return false

	const isVitestEach = vitesCallFn.members.some(s => getAccessorValue(s) === 'each')

	if (isVitestEach && node.callee.type !== AST_NODE_TYPES.TaggedTemplateExpression)
		return true

	const [, callback] = node.arguments

	const callbackArgIndex = Number(isVitestEach)

	return callback && isFunction(callback) && callback.params.length === 1 + callbackArgIndex
}

export default createEslintRule<Options, MESSAGE_IDS>({
	name: RULE_NAME,
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Require promises that have expectations in their chain to be valid',
			recommended: 'error'
		},
		messages: {
			expectInFloatingPromise: 'This promise should either be returned or awaited to ensure the expects in its chain are called'
		},
		schema: []
	},
	defaultOptions: [],
	create(context) {
		let inTestCaseWithDoneCallBack = false

		const chains: boolean[] = []

		return {
			CallExpression(node: TSESTree.CallExpression) {
				if (isTestCaseCallWithCallbackArg(node, context))
					inTestCaseWithDoneCallBack = true
			}
			// 'CallExpression:exit'(node: TSESTree.CallExpression) { }
		}
	}
})
