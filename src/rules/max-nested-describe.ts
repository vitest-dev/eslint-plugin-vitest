import { TSESTree } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'

export const RULE_NAME = 'max-nested-describe'
export type MESSAGE_ID = 'maxNestedDescribe';
export type Options = [
    {
        max: number;
    }
];

export default createEslintRule<Options, MESSAGE_ID>({
    name: RULE_NAME,
    meta: {
        type: 'problem',
        docs: {
            description:
                'Nested describe block should be less than set max value or default value',
            recommended: 'stylistic'
        },
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
        ],
        messages: {
            maxNestedDescribe:
                'Nested describe block should be less than set max value.'
        }
    },
    defaultOptions: [
        {
            max: 5
        }
    ],
    create(context, [{ max }]) {
        const stack: number[] = []

        function pushStack(node: TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression) {
            if (node.parent?.type !== 'CallExpression') return
            if (node.parent.callee.type !== 'Identifier' || node.parent.callee.name !== 'describe')
                return

            stack.push(0)

            if (stack.length > max) {
                context.report({
                    node: node.parent,
                    messageId: 'maxNestedDescribe'
                })
            }
        }
        function popStack(node: TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression) {
            if (node.parent?.type !== 'CallExpression') return
            if (node.parent.callee.type !== 'Identifier' || node.parent.callee.name !== 'describe')
                return

            stack.pop()
        }

        return {
            FunctionExpression: pushStack,
            'FunctionExpression:exit': popStack,
            ArrowFunctionExpression: pushStack,
            'ArrowFunctionExpression:exit': popStack
        }
    }
})
