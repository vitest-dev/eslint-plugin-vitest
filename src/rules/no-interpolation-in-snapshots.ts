import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { createEslintRule, getAccessorValue } from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'

export const RULE_NAME = 'no-interpolation-in-snapshots'
export type MESSAGE_ID = 'noInterpolationInSnapshots'
export type Options = []

export default createEslintRule<Options, MESSAGE_ID>({
    name: RULE_NAME,
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow string interpolation in snapshots',
            recommended: 'strict'
        },
        fixable: 'code',
        schema: [],
        messages: {
            noInterpolationInSnapshots: 'Do not use string interpolation in snapshots'
        }
    },
    defaultOptions: [],
    create(context) {
        return {
            CallExpression(node) {
                const vitestFnCall = parseVitestFnCall(node, context)

                if (vitestFnCall?.type !== 'expect')
                    return

                if (['toMatchInlineSnapshot',
                    'toThrowErrorMatchingInlineSnapshot'].includes(getAccessorValue(vitestFnCall.matcher))) {
                    vitestFnCall.args.forEach(argument => {
                        if (argument.type === AST_NODE_TYPES.TemplateLiteral && argument.expressions.length > 0) {
                            context.report({
                                messageId: 'noInterpolationInSnapshots',
                                node: argument
                            })
                        }
                    })
                }
            }
        }
    }
})
