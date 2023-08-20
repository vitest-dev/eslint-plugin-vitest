import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getAccessorValue } from '../utils'
import { findTopMostCallExpression, parseVitestFnCall } from '../utils/parseVitestFnCall'

export const RULE_NAME = 'unbound-method'

const toThrowMatchers = [
	'toThrow',
	'toThrowError',
	'toThrowErrorMatchingSnapshot',
	'toThrowErrorMatchingInlineSnapshot'
  ]

type MESSAGE_IDS = 'unbound' | 'unboundWithoutThisAnnotation'

const DEFAULT_MESSAGE = 'This rule requires `@typescript-eslint/eslint-plugin`'

interface Config {
	ignoreStatic: boolean;
}

export type Options = [Config];

const baseRule = (() => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const TSESLintPlugin = require('@typescript-eslint/eslint-plugin')

    return TSESLintPlugin.rules['unbound-method'] as TSESLint.RuleModule<
		MESSAGE_IDS,
		Options
		>
	} catch (e: unknown) {
	const error = e as { code: string }

	if (error.code === 'MODULE_NOT_FOUND')
		return null

	throw error
	}
})()

export default createEslintRule<Options, MESSAGE_IDS>({
	defaultOptions: [{ ignoreStatic: false }],
	name: RULE_NAME,
	meta: {
		messages: {
			unbound: DEFAULT_MESSAGE,
			unboundWithoutThisAnnotation: DEFAULT_MESSAGE
		},
		schema: [],
		type: 'problem',
		...baseRule?.meta,
		docs: {
			...baseRule?.meta.docs,
			description: 'Enforce unbound methods are called with their expected scope',
			recommended: 'error',
			requiresTypeChecking: true
		}
	},
	create(context) {
		const baseSelectors = baseRule?.create(context)

		if (!baseSelectors) return {}

		return {
			...baseSelectors,
			MemberExpression(node: TSESTree.MemberExpression) {
				if (node.parent?.type === AST_NODE_TYPES.CallExpression) {
					const vitestFnCall = parseVitestFnCall(
						findTopMostCallExpression(node.parent),
						context
					)

					if (vitestFnCall?.type === 'expect') {
						const { matcher } = vitestFnCall

						if (!toThrowMatchers.includes(getAccessorValue(matcher))) return
					}
				}
				baseSelectors.MemberExpression?.(node)
			}
		}
	}
})
