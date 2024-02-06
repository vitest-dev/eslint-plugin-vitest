import { TSESTree } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'
import { isTypeOfVitestFnCall } from '../utils/parseVitestFnCall'

export const RULE_NAME = 'no-conditional-in-test'
export type MESSAGE_IDS = 'noConditionalInTest';
export type Options = [];

export default createEslintRule<Options, MESSAGE_IDS>({
    name: RULE_NAME,
    meta: {
        docs: {
            description: 'Disallow conditional tests',
            requiresTypeChecking: false,
            recommended: 'warn'
        },
        messages: {
            noConditionalInTest: 'Remove conditional tests'
        },
        schema: [],
        type: 'problem'
    },
    defaultOptions: [],
    create(context) {
        let inTestCase = false

        const reportConditional = (node: TSESTree.Node) => {
            if (inTestCase)
                context.report({ messageId: 'noConditionalInTest', node })
        }

        return {
            CallExpression(node) {
                if (isTypeOfVitestFnCall(node, context, ['test']))
                    inTestCase = true
            },
            'CallExpression:exit'(node) {
                if (isTypeOfVitestFnCall(node, context, ['test']))
                    inTestCase = false
            },
            IfStatement: reportConditional,
            SwitchStatement: reportConditional,
            ConditionalExpression: reportConditional,
            LogicalExpression: reportConditional
        }
    }
})
