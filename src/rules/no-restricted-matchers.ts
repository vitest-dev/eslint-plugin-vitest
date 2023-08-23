import { createEslintRule, getAccessorValue } from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'
import { ModifierName } from '../utils/types'

export const RULE_NAME = 'no-restricted-matchers'
type MESSAGE_IDS = 'restrictedChain' | 'restrictedChainWithMessage';
type Options = Record<string, string | null>[]

const isChainRestricted = (chain: string, restriction: string): boolean => {
	// eslint-disable-next-line no-prototype-builtins
	if (ModifierName.hasOwnProperty(restriction) || restriction.endsWith('.not'))
		return chain.startsWith(restriction)

	return chain === restriction
}

export default createEslintRule<Options, MESSAGE_IDS>({
	name: RULE_NAME,
	meta: {
		docs: {
			description: 'Disallow the use of certain matchers',
			recommended: 'error'
		},
		type: 'suggestion',
		schema: [
			{
				type: 'object',
				additionalProperties: {
					type: ['string', 'null']
				}
			}
		],
		messages: {
			restrictedChain: 'use of `{{ matcher }}` is disallowed',
			restrictedChainWithMessage: '{{ message }}'
		}
	},
	defaultOptions: [{}],
	create(context, [restrictedChains]) {
		return {
			CallExpression(node) {
				const vitestFnCall = parseVitestFnCall(node, context)

				if (vitestFnCall?.type !== 'expect')
					return

				const chain = vitestFnCall.members
					.map(node => getAccessorValue(node))
					.join('.')

				for (const [restriction, message] of Object.entries(restrictedChains)) {
					if (isChainRestricted(chain, restriction)) {
						context.report({
							messageId: message ? 'restrictedChainWithMessage' : 'restrictedChain',
							data: { message, restriction },
							loc: {
								start: vitestFnCall.members[0].loc.start,
								end: vitestFnCall.members[vitestFnCall.members.length - 1].loc.end
							}
						})
						break
					}
				}
			}
		}
	}
})
