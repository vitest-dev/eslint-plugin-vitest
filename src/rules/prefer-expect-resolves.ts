import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'

export const RULE_NAME = 'prefer-expect-resolves'
type MESSAGE_IDS = 'expectResolves'
type Options = []

export default createEslintRule<Options, MESSAGE_IDS>({
	name: RULE_NAME,
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Suggest using `expect().resolves` over `expect(await ...)` syntax',
			recommended: 'warn'
		},
		fixable: 'code',
		messages: {
			expectResolves: 'Use `expect().resolves` instead'
		},
		schema: []
	},
	defaultOptions: [],
	create: (context) => ({
		CallExpression(node) {
			const vitestFnCall = parseVitestFnCall(node, context)

			if (vitestFnCall?.type !== 'expect') return

			const { parent } = vitestFnCall.head.node

			if (parent?.type !== AST_NODE_TYPES.CallExpression)
				return

			const [awaitNode] = parent.arguments

			if (awaitNode?.type === AST_NODE_TYPES.AwaitExpression) {
				context.report({
					node: awaitNode,
					messageId: 'expectResolves',
					fix(fixer) {
						return [
							fixer.insertTextBefore(parent, 'await '),
							fixer.removeRange([
								awaitNode.range[0],
								awaitNode.argument.range[0]
							]),
							fixer.insertTextAfter(parent, '.resolves')
						]
					}
				})
			}
		}
	})
})
