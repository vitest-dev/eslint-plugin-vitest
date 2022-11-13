import { TSESTree } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'

export const RULE_NAME = 'consistent-test-it'
export type MessageIds = 'consistentTestIt';

export default createEslintRule<[
	Partial<{
		fn: 'it' | 'test';
		withInDescribe: 'it' | 'test';
	}>
], MessageIds>({
    name: RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Prefer test or it but not both',
            recommended: false
        },
        messages: {
            consistentTestIt: 'Prefer test or it but not both at the same time'
        },
        schema: [
            {
                type: 'object',
                properties: {
                    fn: {
                        enum: ['test', 'it']
                    },
                    withInDescribe: {
                        enum: ['test', 'it']
                    }
                },
                additionalProperties: false
            }
        ]
    },
    defaultOptions: [
        {
            fn: 'test',
            withInDescribe: 'test'
        }
    ],
    create(context) {
        const options = context.options[0]
        console.log(options)
        return {
            'CallExpression[callee.name=/^(test|it)$/]'(node: TSESTree.CallExpression) {
                console.log(node)
            }
        }
    }
})
