import { createEslintRule, getAccessorValue } from '../utils'
import { parseVitestFnCall } from '../utils/parseVitestFnCall'

export const RULE_NAME = 'no-restricted-vi-methods'
export type MESSAGE_ID = 'restrictedViMethod' | 'restrictedViMethodWithMessage'
export type Options = [Record<string, string | null>]

export default createEslintRule<Options, MESSAGE_ID>({
    name: RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallow specific `vi.` methods',
            recommended: false
        },
        schema: [{
            type: 'object',
            additionalProperties: { type: ['string', 'null'] }
        }],
        messages: {
            restrictedViMethod: 'Use of `{{ restriction }}` is disallowed',
            restrictedViMethodWithMessage: '{{ message }}'
        }
    },
    defaultOptions: [{}],
    create(context, [restrictedMethods]) {
        return {
            CallExpression(node) {
                const vitestFnCall = parseVitestFnCall(node, context)

                if (vitestFnCall?.type !== 'vi' || vitestFnCall.members.length === 0)
                    return

                const method = getAccessorValue(vitestFnCall.members[0])

                if (method in restrictedMethods) {
                    const message = restrictedMethods[method]

                    context.report({
                        messageId: message
                            ? 'restrictedViMethodWithMessage'
                            : 'restrictedViMethod',
                        data: { message, restriction: method },
                        loc: {
                            start: vitestFnCall.members[0].loc.start,
                            end: vitestFnCall.members[vitestFnCall.members.length - 1].loc.end
                        }
                    })
                }
            }
        }
    }
})
