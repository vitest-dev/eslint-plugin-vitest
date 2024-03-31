import { HookName } from '../utils/types'
import { createEslintRule } from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'

export const RULE_NAME = 'no-hooks'
export type MESSAGE_ID = 'unexpectedHook';
export type Options = [];

export default createEslintRule<
    [Partial<{ allow: readonly HookName[] }>],
    MESSAGE_ID
>({
    name: RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallow setup and teardown hooks',
            recommended: 'strict'
        },
        schema: [{
            type: 'object',
            properties: {
                allow: {
                    type: 'array',
                    contains: ['beforeAll', 'beforeEach', 'afterAll', 'afterEach']
                }
            },
            additionalProperties: false
        }],
        messages: {
            unexpectedHook: 'Unexpected \'{{ hookName }}\' hook'
        }
    },
    defaultOptions: [{ allow: [] }],
    create(context, [{ allow = [] }]) {
        return {
            CallExpression(node) {
                const vitestFnCall = parseVitestFnCall(node, context)

                if (
                    vitestFnCall?.type === 'hook' &&
                    !allow.includes(vitestFnCall.name as HookName)
                ) {
                    context.report({
                        node,
                        messageId: 'unexpectedHook',
                        data: { hookName: vitestFnCall.name }
                    })
                }
            }
        }
    }
})
