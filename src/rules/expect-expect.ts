import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getNodeName, isSupportedAccessor } from '../utils'
import { getTestCallExpressionsFromDeclaredVariables, isTypeOfVitestFnCall } from '../utils/parseVitestFnCall'

export const RULE_NAME = 'expect-expect'
export type MESSAGE_ID = 'noAssertions';
type Options = [
	{
		assertFunctionNames: string[],
		additionalTestBlockFunctions: string[]
	}
]

function matchesAssertFunctionName(
    nodeName: string,
    patterns: readonly string[]
): boolean {
	return patterns.some(p =>
		new RegExp(
			`^${p
			.split('.')
			.map(x => {
				if (x === '**')
				return '[a-z\\d\\.]*'

			return x.replace(/\*/gu, '[a-z\\d]*')
			})
			.join('\\.')}(\\.|$)`,
			'ui'
		).test(nodeName)
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
				assertFunctionNames: {
					type: 'array',
					items: [{ type: 'string' }]
				},
				additionalTestBlockFunctions: {
					type: 'array',
					items: { type: 'string' }
				}
			},
			additionalProperties: false
			}
		],
        messages: {
            noAssertions: 'Test has no assertions'
        }
    },
    defaultOptions: [{ assertFunctionNames: ['expect'], additionalTestBlockFunctions: [] }],
    create(context, [{ assertFunctionNames = ['expect'], additionalTestBlockFunctions = [] }]) {
		const unchecked: TSESTree.CallExpression[] = []

		function checkCallExpression(nodes: TSESTree.Node[]) {
			for (const node of nodes) {
				const index = node.type === AST_NODE_TYPES.CallExpression ? unchecked.indexOf(node) : -1

				if (node.type === AST_NODE_TYPES.FunctionDeclaration) {
					const declaredVariables = context.getDeclaredVariables(node)
					const testCallExpressions = getTestCallExpressionsFromDeclaredVariables(declaredVariables, context)

					checkCallExpression(testCallExpressions)
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

				if (isTypeOfVitestFnCall(node, context, ['test']) || additionalTestBlockFunctions.includes(name)) {
					if (node.callee.type === AST_NODE_TYPES.MemberExpression && isSupportedAccessor(node.callee.property, 'todo')) return

					unchecked.push(node)
				} else if (matchesAssertFunctionName(name, assertFunctionNames)) {
					checkCallExpression(context.getAncestors())
				}
            },
			'Program:exit'() {
				unchecked.forEach(node => {
					context.report({
						node: node.callee,
						messageId: 'noAssertions'
					})
				})
			}
        }
    }
})
