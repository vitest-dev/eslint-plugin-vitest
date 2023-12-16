import { createEslintRule } from '../utils'

export const RULE_NAME = 'no-import-node-test'
export type MESSAGE_IDS = 'noImportNodeTest'
export type Options = []

export default createEslintRule<Options, MESSAGE_IDS>({
    name: RULE_NAME,
    meta: {
        docs: {
            description: 'Disallow importing `node:test`',
            recommended: 'strict'
        },
        type: 'suggestion',
        messages: {
            noImportNodeTest: 'Import from `vitest` instead of `node:test`'
        },
        fixable: 'code',
        schema: []
    },
    defaultOptions: [],
    create(context) {
        return {
            ImportDeclaration(node) {
                if (node.source.value === 'node:test') {
                    context.report({
                        messageId: 'noImportNodeTest',
                        node,
                        fix: fixer => fixer.replaceText(
                            node.source,
                            node.source.raw.replace('node:test', 'vitest')
                        )
                    })
                }
            }
        }
    }
})
