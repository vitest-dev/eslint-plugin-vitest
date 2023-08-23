import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getNodeName, isSupportedAccessor } from '../utils'
import { getTestCallExpressionsFromDeclaredVariables, isTypeOfVitestFnCall } from '../utils/parse-vitest-fn-call'

export const RULE_NAME = 'expect-expect'
export type MESSAGE_ID = 'expectedExpect';

/**
 * Checks if node names returned by getNodeName matches any of the given star patterns
 * Pattern examples:
 *   request.*.expect
 *   request.**.expect
 *   request.**.expect*
 */
function matchesAssertFunctionName(
	nodeName: string,
	patterns: readonly string[]
): boolean {
	return patterns.some(p =>
		new RegExp(
			`^${p
				.split('.')
				.map(x => {
					if (x === '**') return '[a-z\\d\\.]*'

					return x.replace(/\*/gu, '[a-z\\d]*')
				})
				.join('\\.')}(\\.|$)`,
			'ui'
		).test(nodeName)
	)
}

export default createEslintRule<[], MESSAGE_ID>({
	name: RULE_NAME,
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce having expectation in test body',
			recommended: 'strict'
		},
		schema: [],
		messages: {
			expectedExpect: 'Use \'expect\' in test body'
		}
	},
	defaultOptions: [],
	create: (context) => {
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
						isSupportedAccessor(node.callee.property, 'todo')) return
					unchecked.push(node)
				} else if (matchesAssertFunctionName(name, ['expect'])) {
					checkCallExpressionUsed(context.getAncestors())
				}
			},
			'Program:exit'() {
				unchecked.forEach(node => context.report({ node, messageId: 'expectedExpect' }))
			}
		}
	}
})
