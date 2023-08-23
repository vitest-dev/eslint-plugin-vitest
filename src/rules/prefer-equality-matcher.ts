import { TSESLint, AST_NODE_TYPES } from '@typescript-eslint/utils'
import { createEslintRule, getAccessorValue } from '../utils'
import { getFirstMatcherArg, parseVitestFnCall } from '../utils/parse-vitest-fn-call'
import { EqualityMatcher, ModifierName } from '../utils/types'
import { isBooleanLiteral } from '../utils/msc'

export const RULE_NAME = 'prefer-equality-matcher'
type MESSAGE_IDS = 'useEqualityMatcher' | 'suggestEqualityMatcher'
type Options = []

export default createEslintRule<Options, MESSAGE_IDS>({
	name: RULE_NAME,
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Suggest using the built-in quality matchers',
			recommended: 'warn'
		},
		messages: {
			useEqualityMatcher: 'Prefer using one of the equality matchers instead',
			suggestEqualityMatcher: 'Use `{{ equalityMatcher }}`'
		},
		hasSuggestions: true,
		schema: []
	},
	defaultOptions: [],
	create(context) {
		return {
			CallExpression(node) {
				const vitestFnCall = parseVitestFnCall(node, context)

				if (vitestFnCall?.type !== 'expect' || vitestFnCall.args.length === 0)
					return

				const { parent: expect } = vitestFnCall.head.node

				if (expect?.type !== AST_NODE_TYPES.CallExpression)
					return

				const {
					arguments: [comparison],
					range: [, expectCallEnd]
				} = expect

				const { matcher } = vitestFnCall
				const matcherArg = getFirstMatcherArg(vitestFnCall)

				if (
					comparison?.type !== AST_NODE_TYPES.BinaryExpression ||
					(comparison.operator !== '===' && comparison.operator !== '!==') ||
					// eslint-disable-next-line no-prototype-builtins
					!EqualityMatcher.hasOwnProperty(getAccessorValue(matcher)) ||
					!isBooleanLiteral(matcherArg)
				)
					return

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const matcherValue = matcherArg.value

				const [modifier] = vitestFnCall.modifiers
				const hasNot = vitestFnCall.modifiers.some(
					nod => getAccessorValue(nod) === 'not'
				)

				const addNotModifier = (comparison.operator === '!==' ? !matcherValue : matcherValue) === hasNot

				const buildFixer = (equalityMatcher: string): TSESLint.ReportFixFunction => fixer => {
					const sourceCode = context.getSourceCode()

					let modifierText = modifier && getAccessorValue(modifier) !== 'not' ? `.${getAccessorValue(modifier)}` : ''

					if (addNotModifier)
						modifierText += `.${ModifierName.not}`

					return [
						fixer.replaceText(
							comparison,
							sourceCode.getText(comparison.left)
						),
						fixer.replaceTextRange(
							[expectCallEnd, matcher.parent.range[1]],
							`${modifierText}.${equalityMatcher}`
						),
						fixer.replaceText(
							matcherArg,
							sourceCode.getText(comparison.right)
						)
					]
				}

				context.report({
					messageId: 'useEqualityMatcher',
					suggest: ['toBe', 'toEqual', 'toStrictEqual'].map(equalityMatcher => ({
						messageId: 'suggestEqualityMatcher',
						data: { equalityMatcher },
						fix: buildFixer(equalityMatcher)
					})),
					node: matcher
				})
			}
		}
	}
})
