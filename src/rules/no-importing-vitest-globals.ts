import { TSESTree } from '@typescript-eslint/utils';
import { createEslintRule } from '../utils'

export const RULE_NAME = 'no-importing-vitest-globals'
export type MESSAGE_IDS = 'noImportingVitestGlobals'
export type Options = []

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow importing Vitest globals',
      recommended: false
    },
    messages: {
      noImportingVitestGlobals: "Do not import Vitest global '{{name}}' from 'vitest'. Use globals configuration instead.",
    },
    fixable: 'code',
    schema: []
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        if (node.source.value !== 'vitest') {
          return;
        }

        context.report({
          node,
          messageId: 'noImportingVitestGlobals',
          data: {
            name: "TODO",
          },
        });
      }
    }
  }
})
