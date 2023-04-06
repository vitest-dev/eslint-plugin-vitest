import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils'
import { KnownCallExpression, createEslintRule, getAccessorValue, getNodeName, isFunction, isIdentifier, isSupportedAccessor } from '../utils'
import { findTopMostCallExpression, isTypeOfVitestFnCall, parseVitestFnCall } from '../utils/parseVitestFnCall'
import { ModifierName } from '../utils/types'

export const RULE_NAME = 'valid-expect-in-promise'
type MESSAGE_IDS = 'expectInFloatingPromise'
type Options = []

type PromiseChainCallExpression = KnownCallExpression<
	'then' | 'catch' | 'finally'
>;

const isPromiseChainCall = (
	node: TSESTree.Node
): node is PromiseChainCallExpression => {
	if (
		node.type === AST_NODE_TYPES.CallExpression &&
		node.callee.type === AST_NODE_TYPES.MemberExpression &&
		isSupportedAccessor(node.callee.property)
	) {
		// promise methods should have at least 1 argument
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

const isTestCaseCallWithCallbackArg = (
	node: TSESTree.CallExpression,
	context: TSESLint.RuleContext<string, unknown[]>
): boolean => {
	const VitestCallFn = parseVitestFnCall(node, context)

	if (VitestCallFn?.type !== 'test')
		return false

	const isVitestEach = VitestCallFn.members.some(
		s => getAccessorValue(s) === 'each'
	)

	if (
		isVitestEach &&
		node.callee.type !== AST_NODE_TYPES.TaggedTemplateExpression
	)
		return true

	const [, callback] = node.arguments

	const callbackArgIndex = Number(isVitestEach)

	return (
		callback &&
		isFunction(callback) &&
		callback.params.length === 1 + callbackArgIndex
	)
}

const isPromiseMethodThatUsesValue = (
	node: TSESTree.AwaitExpression | TSESTree.ReturnStatement,
	identifier: TSESTree.Identifier
): boolean => {
	const { name } = identifier

	if (node.argument === null)
		return false

	if (
		node.argument.type === AST_NODE_TYPES.CallExpression &&
		node.argument.arguments.length > 0
	) {
		const nodeName = getNodeName(node.argument)

		if (['Promise.all', 'Promise.allSettled'].includes(nodeName as string)) {
			const [firstArg] = node.argument.arguments

			if (
				firstArg.type === AST_NODE_TYPES.ArrayExpression &&
				firstArg.elements.some(nod => nod && isIdentifier(nod, name))
			)
				return true
		}

		if (
			['Promise.resolve', 'Promise.reject'].includes(nodeName as string) &&
			node.argument.arguments.length === 1
		)
			return isIdentifier(node.argument.arguments[0], name)
	}

	return isIdentifier(node.argument, name)
}

/**
 * Attempts to determine if the runtime value represented by the given `identifier`
 * is `await`ed within the given array of elements
 */
const isValueAwaitedInElements = (
	name: string,
	elements:
		| TSESTree.ArrayExpression['elements']
		| TSESTree.CallExpression['arguments']
): boolean => {
	for (const element of elements) {
		if (
			element?.type === AST_NODE_TYPES.AwaitExpression &&
			isIdentifier(element.argument, name)
		)
			return true

		if (
			element?.type === AST_NODE_TYPES.ArrayExpression &&
			isValueAwaitedInElements(name, element.elements)
		)
			return true
	}

	return false
}

const isValueAwaitedInArguments = (
	name: string,
	call: TSESTree.CallExpression
): boolean => {
	let node: TSESTree.Node = call

	while (node) {
		if (node.type === AST_NODE_TYPES.CallExpression) {
			if (isValueAwaitedInElements(name, node.arguments))
				return true

			node = node.callee
		}

		if (node.type !== AST_NODE_TYPES.MemberExpression)
			break

		node = node.object
	}

	return false
}

const getLeftMostCallExpression = (
	call: TSESTree.CallExpression
): TSESTree.CallExpression => {
	let leftMostCallExpression: TSESTree.CallExpression = call
	let node: TSESTree.Node = call

	while (node) {
		if (node.type === AST_NODE_TYPES.CallExpression) {
			leftMostCallExpression = node
			node = node.callee
		}

		if (node.type !== AST_NODE_TYPES.MemberExpression)
			break

		node = node.object
	}

	return leftMostCallExpression
}

/**
 * Attempts to determine if the runtime value represented by the given `identifier`
 * is `await`ed or `return`ed within the given `body` of statements
 */
const isValueAwaitedOrReturned = (
	identifier: TSESTree.Identifier,
	body: TSESTree.Statement[],
	context: TSESLint.RuleContext<string, unknown[]>
): boolean => {
	const { name } = identifier

	for (const node of body) {
		// skip all nodes that are before this identifier, because they'd probably
		// be affecting a different runtime value (e.g. due to reassignment)
		if (node.range[0] <= identifier.range[0])
			continue

		if (node.type === AST_NODE_TYPES.ReturnStatement)
			return isPromiseMethodThatUsesValue(node, identifier)

		if (node.type === AST_NODE_TYPES.ExpressionStatement) {
			// it's possible that we're awaiting the value as an argument
			if (node.expression.type === AST_NODE_TYPES.CallExpression) {
				if (isValueAwaitedInArguments(name, node.expression))
					return true

				const leftMostCall = getLeftMostCallExpression(node.expression)
				const VitestFnCall = parseVitestFnCall(node.expression, context)

				if (
					VitestFnCall?.type === 'expect' &&
					leftMostCall.arguments.length > 0 &&
					isIdentifier(leftMostCall.arguments[0], name)
				) {
					if (
						VitestFnCall.members.some(m => {
							const v = getAccessorValue(m)

							return v === ModifierName.resolves || v === ModifierName.rejects
						})
					)
						return true
				}
			}

			if (
				node.expression.type === AST_NODE_TYPES.AwaitExpression &&
				isPromiseMethodThatUsesValue(node.expression, identifier)
			)
				return true

			// (re)assignment changes the runtime value, so if we've not found an
			// await or return already we act as if we've reached the end of the body
			if (node.expression.type === AST_NODE_TYPES.AssignmentExpression) {
				// unless we're assigning to the same identifier, in which case
				// we might be chaining off the existing promise value
				if (
					isIdentifier(node.expression.left, name) &&
					getNodeName(node.expression.right)?.startsWith(`${name}.`) &&
					isPromiseChainCall(node.expression.right)
				)
					continue

				break
			}
		}

		if (
			node.type === AST_NODE_TYPES.BlockStatement &&
			isValueAwaitedOrReturned(identifier, node.body, context)
		)
			return true
	}

	return false
}

const findFirstBlockBodyUp = (
	node: TSESTree.Node
): TSESTree.BlockStatement['body'] => {
	let parent: TSESTree.Node['parent'] = node

	while (parent) {
		if (parent.type === AST_NODE_TYPES.BlockStatement)
			return parent.body

		parent = parent.parent
	}

	/* istanbul ignore next */
	throw new Error(
		'Could not find BlockStatement - please file a github issue at https://github.com/Vitest-community/eslint-plugin-Vitest'
	)
}

const isDirectlyWithinTestCaseCall = (
	node: TSESTree.Node,
	context: TSESLint.RuleContext<string, unknown[]>
): boolean => {
	let parent: TSESTree.Node['parent'] = node

	while (parent) {
		if (isFunction(parent)) {
			parent = parent.parent

			return (
				parent?.type === AST_NODE_TYPES.CallExpression &&
				isTypeOfVitestFnCall(parent, context, ['test'])
			)
		}

		parent = parent.parent
	}

	return false
}

const isVariableAwaitedOrReturned = (
	variable: TSESTree.VariableDeclarator,
	context: TSESLint.RuleContext<string, unknown[]>
): boolean => {
	const body = findFirstBlockBodyUp(variable)

	// it's pretty much impossible for us to track destructuring assignments,
	// so we return true to bailout gracefully
	if (!isIdentifier(variable.id))
		return true

	return isValueAwaitedOrReturned(variable.id, body, context)
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
				if (isTestCaseCallWithCallbackArg(node, context)) {
					inTestCaseWithDoneCallBack = true
					return
				}

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

				if (!isPromiseChainCall(node)) return

				const hasExpectCall = chains.shift()

				if (!hasExpectCall) return

				const { parent } = findTopMostCallExpression(node)

				if (!parent || !isDirectlyWithinTestCaseCall(node, context))
					return

				switch (parent.type) {
					case AST_NODE_TYPES.VariableDeclarator: {
						// eslint-disable-next-line no-useless-return
						if (isVariableAwaitedOrReturned(parent, context)) return
						break
					}
					case AST_NODE_TYPES.AssignmentExpression: {
						// eslint-disable-next-line no-useless-return
						if (parent.left.type === AST_NODE_TYPES.Identifier &&
							isValueAwaitedOrReturned(parent.left, findFirstBlockBodyUp(parent), context))
							return
						break
					}

					case AST_NODE_TYPES.ExpressionStatement:
						break
					case AST_NODE_TYPES.ReturnStatement:
					case AST_NODE_TYPES.AwaitExpression:
					default:
				}

				context.report({
					messageId: 'expectInFloatingPromise',
					node: parent
				})
			}
		}
	}
})
