import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils'
import { KnownCallExpression, createEslintRule, getAccessorValue, isFunction, isSupportedAccessor } from '../utils'
import { isTypeOfVitestFnCall, parseVitestFnCall } from '../utils/parseVitestFnCall'

export const RULE_NAME = 'valid-expect-in-promise'
type MESSAGE_IDS = 'expectInFloatingPromise'
type Options = []

type PromiseChainCallExpression = KnownCallExpression<
	'then' | 'catch' | 'finally'
>;

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

const isPromiseChainCall = (node: TSESTree.Node): node is PromiseChainCallExpression => {
	if (node.type === AST_NODE_TYPES.CallExpression &&
		node.callee.type === AST_NODE_TYPES.MemberExpression &&
		isSupportedAccessor(node.callee.property)) {
		if (node.arguments.length === 0)
			return false

		switch (getAccessorValue(node.callee.property)) {
			case 'then':
				return node.arguments.length < 3
			case 'catch':
			case 'finally':
				return node.arguments.length < 2
		}
	}

	return false
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

				if (isPromiseChainCall(node)) {
					chains.unshift(false)

					return
				}

				if (chains.length > 0 && isTypeOfVitestFnCall(node, context, ['expect']))
					chains[0] = true
			},
			'CallExpression:exit'(node: TSESTree.CallExpression) {
				if (inTestCaseWithDoneCallBack) {
					if (isTypeOfVitestFnCall(node, context, ['test']))
						inTestCaseWithDoneCallBack = false

					return
				}

				if (isPromiseChainCall(node)) return

				const hasExpectCall = chains.shift()

				// TODO: start from here
			}
		}
	}
})
