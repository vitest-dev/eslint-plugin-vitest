import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { createEslintRule, FunctionExpression } from '../utils'
import { isTypeOfVitestFnCall, parseVitestFnCall } from '../utils/parseVitestFnCall'

export const RULE_NAME = 'max-expects'
export type MESSAGE_ID = 'maxExpect';
export type Options = [
    {
        max: number
    }
]

export default createEslintRule<Options, MESSAGE_ID>({
    name: RULE_NAME,
    meta: {
        docs: {
            requiresTypeChecking: false,
            recommended: 'error',
            description: 'Enforce a maximum number of expect per test'
        },
        messages: {
            maxExpect: 'Too many assertion calls ({{count}}). Maximum is {{max}}.'
        },
        type: 'suggestion',
        schema: [
            {
                type: 'object',
                properties: {
                    max: {
                        type: 'number'
                    }
                },
                additionalProperties: false
            }
        ]
    },
    defaultOptions: [{ max: 5 }],
    create(context, [{ max }]) {
        let assertsCount = 0

        const resetAssertCount = (node: FunctionExpression) => {
            const isFunctionTest = node.parent?.type !== AST_NODE_TYPES.CallExpression ||
                isTypeOfVitestFnCall(node.parent, context, ['test'])

            if (isFunctionTest)
                assertsCount = 0
        }

        return {
            FunctionExpression: resetAssertCount,
            'FunctionExpression:exit': resetAssertCount,
            ArrowFunctionExpression: resetAssertCount,
            'ArrowFunctionExpression:exit': resetAssertCount,
            CallExpression(node) {
                const vitestFnCall = parseVitestFnCall(node, context)

                if (vitestFnCall?.type !== 'expect' || vitestFnCall.head.node.parent?.type === AST_NODE_TYPES.MemberExpression)
                    return

                assertsCount += 1

                if (assertsCount > max) {
                    context.report({
                        node,
                        messageId: 'maxExpect',
                        data: {
                            count: assertsCount,
                            max
                        }
                    })
                }
            }
        }
    }
})
