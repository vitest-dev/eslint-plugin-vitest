import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, isSupportedAccessor, KnownCallExpression } from '../utils'
import { getTestCallExpressionsFromDeclaredVariables, isTypeOfVitestFnCall, parseVitestFnCall } from '../utils/parse-vitest-fn-call'

export const RULE_NAME = 'no-conditional-expect'
export type MESSAGE_ID = 'noConditionalExpect';
export type Options = [];

const isCatchCall = (
    node: TSESTree.CallExpression
): node is KnownCallExpression<'catch'> =>
    node.callee.type === AST_NODE_TYPES.MemberExpression &&
    isSupportedAccessor(node.callee.property, 'catch')

export default createEslintRule<Options, MESSAGE_ID>({
    name: RULE_NAME,
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow conditional expects',
            requiresTypeChecking: false,
            recommended: 'strict'
        },
        messages: {
            noConditionalExpect: 'Avoid calling `expect` inside conditional statements'
        },
        schema: []
    },
    defaultOptions: [],
    create(context) {
        let conditionalDepth = 0
        let inTestCase = false
        let inPromiseCatch = false

        const increaseConditionalDepth = () => inTestCase && conditionalDepth++
        const decreaseConditionalDepth = () => inTestCase && conditionalDepth--

        return {
            FunctionDeclaration(node) {
                const declaredVariables = context.sourceCode.getDeclaredVariables(node)
                const testCallExpressions = getTestCallExpressionsFromDeclaredVariables(declaredVariables, context)

                if (testCallExpressions.length > 0)
                    inTestCase = true
            },
            CallExpression(node: TSESTree.CallExpression) {
                const { type: vitestFnCallType } = parseVitestFnCall(node, context) ?? {}

                if (vitestFnCallType === 'test')
                    inTestCase = true

                if (isCatchCall(node))
                    inPromiseCatch = true

                if (inTestCase && vitestFnCallType === 'expect' && conditionalDepth > 0) {
                    context.report({
                        messageId: 'noConditionalExpect',
                        node
                    })
                }

                if (inPromiseCatch && vitestFnCallType === 'expect') {
                    context.report({
                        messageId: 'noConditionalExpect',
                        node
                    })
                }
            },
            'CallExpression:exit'(node) {
                if (isTypeOfVitestFnCall(node, context, ['test']))
                    inTestCase = false

                if (isCatchCall(node))
                    inPromiseCatch = false
            },
            CatchClause: increaseConditionalDepth,
            'CatchClause:exit': decreaseConditionalDepth,
            IfStatement: increaseConditionalDepth,
            'IfStatement:exit': decreaseConditionalDepth,
            SwitchStatement: increaseConditionalDepth,
            'SwitchStatement:exit': decreaseConditionalDepth,
            ConditionalExpression: increaseConditionalDepth,
            'ConditionalExpression:exit': decreaseConditionalDepth,
            LogicalExpression: increaseConditionalDepth,
            'LogicalExpression:exit': decreaseConditionalDepth
        }
    }
})
