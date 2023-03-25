import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getAccessorValue, isSupportedAccessor } from '../utils'
import { parseVitestFnCallWithReason } from '../utils/parseVitestFnCall'
import { ModifierName } from '../utils/types'

export const RULE_NAME = 'valid-expect'
export type MESSAGE_IDS =
	| 'tooManyArgs'
	| 'notEnoughArgs'
	| 'modifierUnknown'
	| 'matcherNotFound'
	| 'matcherNotCalled'
	| 'asyncMustBeAwaited'
	| 'promisesWithAsyncAssertionsMustBeAwaited';

const defaultAsyncMatchers = ['toReject', 'toResolve']

/**
 * Async assertions might be called in Promise
 * methods like `Promise.x(expect1)` or `Promise.x([expect1, expect2])`.
 * If that's the case, Promise node have to be awaited or returned.
 *
 * @Returns CallExpressionNode
 */
const getPromiseCallExpressionNode = (node: TSESTree.Node) => {
	if (
		node.type === AST_NODE_TYPES.ArrayExpression &&
		node.parent &&
		node.parent.type === AST_NODE_TYPES.CallExpression
	)
		node = node.parent

	if (
		node.type === AST_NODE_TYPES.CallExpression &&
		node.callee.type === AST_NODE_TYPES.MemberExpression &&
		isSupportedAccessor(node.callee.object, 'Promise') &&
		node.parent
	)
		return node

	return null
}

const promiseArrayExceptionKey = ({ start, end }: TSESTree.SourceLocation) =>
	`${start.line}:${start.column}-${end.line}:${end.column}`

function getParentIfThenified(node: TSESTree.Node): TSESTree.Node {
	const grandParentNode = node.parent?.parent

	if (grandParentNode &&
		grandParentNode.type === AST_NODE_TYPES.CallExpression &&
		grandParentNode.callee.type === AST_NODE_TYPES.MemberExpression &&
		isSupportedAccessor(grandParentNode.callee.property) &&
		['then', 'catch'].includes(getAccessorValue(grandParentNode.callee.property)) && grandParentNode.parent)
		return getParentIfThenified(grandParentNode)

	return node
}

const findPromiseCallExpressionNode = (node: TSESTree.Node) =>
	node.parent?.parent &&
		[AST_NODE_TYPES.CallExpression, AST_NODE_TYPES.ArrayExpression].includes(
			node.parent.type
		)
		? getPromiseCallExpressionNode(node.parent)
		: null

const isAcceptableReturnNode = (
	node: TSESTree.Node,
	allowReturn: boolean
): node is
	| TSESTree.ConditionalExpression
	| TSESTree.ArrowFunctionExpression
	| TSESTree.AwaitExpression
	| TSESTree.ReturnStatement => {
	if (allowReturn && node.type === AST_NODE_TYPES.ReturnStatement)
		return true

	if (node.type === AST_NODE_TYPES.ConditionalExpression && node.parent)
		return isAcceptableReturnNode(node.parent, allowReturn)

	return [
		AST_NODE_TYPES.ArrowFunctionExpression,
		AST_NODE_TYPES.AwaitExpression
	].includes(node.type)
}

export default createEslintRule<[
	Partial<{
		alwaysAwait: boolean;
		asyncMatchers: string[];
		minArgs: number;
		maxArgs: number;
	}>
], MESSAGE_IDS>({
	name: RULE_NAME,
	meta: {
		docs: {
			description: 'Enforce valid `expect()` usage',
			recommended: 'error'
		},
		messages: {
			tooManyArgs: 'Expect takes most {{ amount}} argument{{s}}',
			notEnoughArgs: 'Expect requires atleast {{ amount }} argument{{s}}',
			modifierUnknown: 'Expect has unknown modifier',
			matcherNotFound: 'Expect must have a corresponding matcher call.',
			matcherNotCalled: 'Matchers must be called to assert.',
			asyncMustBeAwaited: 'Async assertions must be awaited{{orReturned}}',
			promisesWithAsyncAssertionsMustBeAwaited:
				'Promises which return async assertions must be awaited{{orReturned}}'
		},
		type: 'suggestion',
		schema: [
			{
				type: 'object',
				properties: {
					alwaysAwait: {
						type: 'boolean',
						default: false
					},
					asyncMatchers: {
						type: 'array',
						items: { type: 'string' }
					},
					minArgs: {
						type: 'number',
						minimum: 1
					},
					maxArgs: {
						type: 'number',
						minimum: 1
					}
				},
				additionalProperties: false
			}
		]
	},
	defaultOptions: [{
		alwaysAwait: false,
		asyncMatchers: defaultAsyncMatchers,
		minArgs: 1,
		maxArgs: 1
	}],
	create: (context, [{ alwaysAwait, asyncMatchers = defaultAsyncMatchers, minArgs = 1, maxArgs = 1 }]) => {
		const arrayExceptions = new Set<string>()

		const pushPromiseArrayException = (loc: TSESTree.SourceLocation) => arrayExceptions.add(promiseArrayExceptionKey(loc))

		/**
		* Promise method that accepts an array of promises,
		* (eg. Promise.all), will throw warnings for the each
		* unawaited or non-returned promise. To avoid throwing
		* multiple warnings, we check if there is a warning in
		* the given location.
		*/
		const promiseArrayExceptionExists = (loc: TSESTree.SourceLocation) =>
			arrayExceptions.has(promiseArrayExceptionKey(loc))

		const findTopMostMemberExpression = (node: TSESTree.MemberExpression): TSESTree.MemberExpression => {
			let topMostMemberExpression = node
			let { parent } = node

			while (parent) {
				if (parent.type !== AST_NODE_TYPES.MemberExpression)
					break

				topMostMemberExpression = parent
				parent = parent.parent
			}
			return topMostMemberExpression
		}

		return {
			CallExpression(node) {
				const vitestFnCall = parseVitestFnCallWithReason(node, context)

				if (typeof vitestFnCall === 'string') {
					const reportingNode =
						node.parent?.type === AST_NODE_TYPES.MemberExpression
							? findTopMostMemberExpression(node.parent).property
							: node

					if (vitestFnCall === 'matcher-not-found') {
						context.report({
							messageId: 'matcherNotFound',
							node: reportingNode
						})

						return
					}

					if (vitestFnCall === 'matcher-not-called') {
						context.report({
							messageId: isSupportedAccessor(reportingNode) &&
								// eslint-disable-next-line no-prototype-builtins
								ModifierName.hasOwnProperty(getAccessorValue(reportingNode))
								? 'matcherNotFound'
								: 'matcherNotCalled',
							node: reportingNode
						})
					}

					if (vitestFnCall === 'modifier-unknown') {
						context.report({
							messageId: 'modifierUnknown',
							node: reportingNode
						})
						return
					}
					return
				} else if (vitestFnCall?.type !== 'expect') {
					return
				}

				const { parent: expect } = vitestFnCall.head.node

				if (expect?.type !== AST_NODE_TYPES.CallExpression)
					return

				if (expect.arguments.length < minArgs) {
					const expectLength = getAccessorValue(vitestFnCall.head.node).length

					const loc: TSESTree.SourceLocation = {
						start: {
							column: expect.loc.start.column + expectLength,
							line: expect.loc.start.line
						},
						end: {
							column: expect.loc.start.column + expectLength + 1,
							line: expect.loc.start.line
						}
					}

					context.report({
						messageId: 'notEnoughArgs',
						data: { amount: minArgs, s: minArgs === 1 ? '' : 's' },
						node: expect,
						loc
					})
				}

				if (expect.arguments.length > maxArgs) {
					const { start } = expect.arguments[maxArgs].loc
					const { end } = expect.arguments[expect.arguments.length - 1].loc

					const loc = {
						start,
						end: {
							column: end.column + 1,
							line: end.line
						}
					}

					context.report({
						messageId: 'tooManyArgs',
						data: { amount: maxArgs, s: maxArgs === 1 ? '' : 's' },
						node: expect,
						loc
					})
				}

				const { matcher } = vitestFnCall

				const parentNode = matcher.parent.parent
				const shouldBeAwaited =
					vitestFnCall.modifiers.some(nod => getAccessorValue(nod) !== 'not') ||
					asyncMatchers.includes(getAccessorValue(matcher))

				if (!parentNode?.parent || !shouldBeAwaited)
					return

				const isParentArrayExpression =
					parentNode.parent.type === AST_NODE_TYPES.ArrayExpression
				const orReturned = alwaysAwait ? '' : ' or returned'

				const targetNode = getParentIfThenified(parentNode)
				const finalNode = findPromiseCallExpressionNode(targetNode) || targetNode

				if (finalNode.parent &&
					!isAcceptableReturnNode(finalNode.parent, !alwaysAwait) &&
					!promiseArrayExceptionExists(finalNode.loc)) {
					context.report({
						loc: finalNode.loc,
						data: { orReturned },
						messageId: finalNode === targetNode
							? 'asyncMustBeAwaited'
							: 'promisesWithAsyncAssertionsMustBeAwaited',
						node
					})

					if (isParentArrayExpression)
						pushPromiseArrayException(finalNode.loc)
				}
			}
		}
	}
})
