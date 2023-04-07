import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getAccessorValue, isStringNode } from '../utils'
import { getFirstMatcherArg, parseVitestFnCall } from '../utils/parseVitestFnCall'
import { EqualityMatcher } from '../utils/types'
import { isBooleanLiteral } from '../utils/msc'

export const RULE_NAME = 'prefer-comparison-matcher'
type MESSAGE_IDS = 'useToBeComparison';
type Options = []

const isString = (node: TSESTree.Node) => {
	return isStringNode(node) || node.type === AST_NODE_TYPES.TemplateLiteral
}

const isComparingToString = (expression: TSESTree.BinaryExpression) => {
	return isString(expression.left) || isString(expression.right)
}

const invertOperator = (operator: string) => {
	switch (operator) {
		case '>':
			return '<='
		case '<':
			return '>='
		case '>=':
			return '<'
		case '<=':
			return '>'
	}
	return null
}

const determineMatcher = (operator: string, negated: boolean): string | null => {
	const op = negated ? invertOperator(operator) : operator

	switch (op) {
		case '>':
			return 'toBeGreaterThan'
		case '<':
			return 'toBeLessThan'
		case '>=':
			return 'toBeGreaterThanOrEqual'
		case '<=':
			return 'toBeLessThanOrEqual'
	}

	return null
}

export default createEslintRule<Options, MESSAGE_IDS>({
	name: RULE_NAME,
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Suggest using the built-in comparison matchers',
			recommended: 'error'
		},
		schema: [],
		fixable: 'code',
		messages: {
			useToBeComparison: 'Prefer using `{{ preferredMatcher }}` instead'
		}
	},
	defaultOptions: [],
	create(context) {
		return {
			CallExpression(node) {
				const vitestFnCall = parseVitestFnCall(node, context)

				if (vitestFnCall?.type !== 'expect' || vitestFnCall.args.length === 0)
					return

				const { parent: expect } = vitestFnCall.head.node

				if (expect?.type !== AST_NODE_TYPES.CallExpression) return

				const {
					arguments: [comparison],
					range: [, expectCallEnd]
				} = expect

				const { matcher } = vitestFnCall
				const matcherArg = getFirstMatcherArg(vitestFnCall)

				if (comparison.type !== AST_NODE_TYPES.BinaryExpression ||
					isComparingToString(comparison) ||
					// eslint-disable-next-line no-prototype-builtins
					!EqualityMatcher.hasOwnProperty(getAccessorValue(matcher)) ||
					!isBooleanLiteral(matcherArg))
					return

				const [modifier] = vitestFnCall.modifiers
				const hasNot = vitestFnCall.modifiers.some(nod => getAccessorValue(nod) === 'not')

				const preferredMatcher = determineMatcher(comparison.operator, matcherArg.value === hasNot)

				if (!preferredMatcher) return

				context.report({
					fix(fixer) {
						const sourceCode = context.getSourceCode()

						const modifierText =
							modifier && getAccessorValue(modifier) !== 'not'
								? `.${getAccessorValue(modifier)}`
								: ''

						return [
							fixer.replaceText(
								comparison,
								sourceCode.getText(comparison.left)
							),
							fixer.replaceTextRange(
								[expectCallEnd, matcher.parent.range[1]],
								`${modifierText}.${preferredMatcher}`
							),
							fixer.replaceText(
								matcherArg,
								sourceCode.getText(comparison.right)
							)
						]
					},
					messageId: 'useToBeComparison',
					data: { preferredMatcher },
					node: matcher
				})
			}
		}
	}
})
