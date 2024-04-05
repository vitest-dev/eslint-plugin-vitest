import { TSESTree } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'

export const RULE_NAME = 'no-conditional-tests'
export type MESSAGE_ID = 'noConditionalTests';

export default createEslintRule<[], MESSAGE_ID>({
    name: RULE_NAME,
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow conditional tests',
            recommended: 'strict'
        },
        schema: [],
        messages: {
            noConditionalTests: 'Avoid using if conditions in a test.'
        }
    },
    defaultOptions: [],
    create(context) {
        return {
            Identifier: function (node: TSESTree.Identifier) {
                if (['test', 'it', 'describe'].includes(node.name)) {
 if (node.parent?.parent?.parent?.parent?.type === 'IfStatement') {
                        context.report({
                            node,
                            messageId: 'noConditionalTests'
                        })
                    }
}
            }
        }
    }
})
