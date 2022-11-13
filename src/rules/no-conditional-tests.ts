import { createEslintRule } from '../utils'

export const RULE_NAME = 'no-conditional-tests'
export type MESSAGE_ID = 'noConditionalTests'

export default createEslintRule<[], MESSAGE_ID>({
    name: RULE_NAME,
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow conditional tests',
            recommended: 'error'

        },
        fixable: 'code',
        schema: [],
        messages: {
            noConditionalTests: 'Conditional tests are not allowed.'
        }
    },
    defaultOptions: [],
    create(context) {
        function checkConditionalTest(node) {
            if (node.arguments[1].body.body.find((n) => n.type === 'IfStatement')) {
                context.report({
                    node,
                    messageId: 'noConditionalTests'
                })
            }

            // check if there is ternary operator in the test
            if (node.arguments[1].body.body.find((n) => n.type === 'ExpressionStatement' && n.expression.type === 'CallExpression')) {
                context.report({
                    node,
                    messageId: 'noConditionalTests'
                })
            }

            // check if there is a switch statement in the test
            if (node.arguments[1].body.body.find((n) => n.type === 'SwitchStatement')) {
                context.report({
                    node,
                    messageId: 'noConditionalTests'
                })
            }
        }

        return {
            'CallExpression[callee.name=/^(it|test)$/]'(node) {
                checkConditionalTest(node)
            }
        }
    }
})
