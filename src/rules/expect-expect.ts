import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getNodeName, isSupportedAccessor } from '../utils'
import { getTestCallExpressionsFromDeclaredVariables, isTypeOfVitestFnCall } from '../utils/parseVitestFnCall'

export const RULE_NAME = 'expect-expect'
export type MESSAGE_ID = 'expectedExpect';
type Options = [{customExpressions: string[]}]

/**
 * Checks if node names returned by getNodeName matches any of the given star patterns
 * Pattern examples:
 *   request.*.expect
 *   request.**.expect
 *   request.**.expect*
 */
function buildRegularExpression(pattern: string) {
	return new RegExp(
		`^${pattern
			.split('.')
			.map(x => {
				if (x === '**') return '[a-z\\d\\.]*'

				return x.replace(/\*/gu, '[a-z\\d]*')
			})
			.join('\\.')}(\\.|$)`,
		'ui')
}

function matchesAssertFunctionName(
	nodeName: string,
	patterns: readonly string[]
): boolean {
	return patterns.some(pattern =>
		buildRegularExpression(pattern).test(nodeName)
	)
}

export default createEslintRule<Options, MESSAGE_ID>({
	name: RULE_NAME,
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce having expectation in test body',
			recommended: 'strict'
		},
		schema: [
			{
				type: 'object',
				properties: {
					customExpressions: {
						type: 'array'
					}
				},
				additionalProperties: false
			}
		],
		messages: {
			expectedExpect: 'Use {{ expected }} in test body'
		}
	},
	defaultOptions: [{ customExpressions: ['expect'] }],
	create(context, [{ customExpressions }]) {
		const unchecked: TSESTree.CallExpression[] = []

		function checkCallExpressionUsed(nodes: TSESTree.Node[]) {
			for (const node of nodes) {
				const index = node.type === AST_NODE_TYPES.CallExpression
					? unchecked.indexOf(node)
					: -1

				if (node.type === AST_NODE_TYPES.FunctionDeclaration) {
					const declaredVariables = context.getDeclaredVariables(node)
					const textCallExpression = getTestCallExpressionsFromDeclaredVariables(declaredVariables, context)
					checkCallExpressionUsed(textCallExpression)
				}
				if (index !== -1) {
					unchecked.splice(index, 1)
					break
				}
			}
		}

		return {
			CallExpression(node) {
				const name = getNodeName(node) ?? ''

				if (isTypeOfVitestFnCall(node, context, ['test'])) {
					if (node.callee.type === AST_NODE_TYPES.MemberExpression &&
						(isSupportedAccessor(node.callee.property, 'todo') || isSupportedAccessor(node.callee.property, 'skip')))
						return

					unchecked.push(node)
				} else if (matchesAssertFunctionName(name, customExpressions)) {
					checkCallExpressionUsed(context.getAncestors())
				}
			},
			'Program:exit'() {
				unchecked.forEach(node => context.report({ node, messageId: 'expectedExpect', data: { expected: customExpressions.join(' or ') } }))
			}
		}
	}
})
