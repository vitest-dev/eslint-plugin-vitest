import { createEslintRule, getAccessorValue } from '../utils'
import { parseVitestFnCall } from '../utils/parseVitestFnCall'

export const RULE_NAME = 'prefer-called-with'
type MESSAGE_IDS = 'preferCalledWith'
type Options = []

export default createEslintRule<Options, MESSAGE_IDS>({
	name: RULE_NAME,
	meta: {
		docs: {
			description:
				'Suggest using `toBeCalledWith()` or `toHaveBeenCalledWith()`',
			recommended: 'warn'
		},
		messages: {
			preferCalledWith: 'Prefer {{ matcherName }}With(/* expected args */)'
		},
		type: 'suggestion',
		schema: []
	},
	defaultOptions: [],
	create(context) {
		return {
			CallExpression(node) {
				const vitestFnCall = parseVitestFnCall(node, context)

				if (vitestFnCall?.type !== 'expect') return

				if (vitestFnCall.modifiers.some(node => getAccessorValue(node) === 'not')) return

				const { matcher } = vitestFnCall
				const matcherName = getAccessorValue(matcher)

				if (['toBeCalled', 'toHaveBeenCalled'].includes(matcherName)) {
					context.report({
						data: { matcherName },
						messageId: 'preferCalledWith',
						node: matcher
					})
				}
			}
		}
	}
})
