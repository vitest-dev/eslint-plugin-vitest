import { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { createEslintRule } from '../utils'

export const RULE_NAME = 'no-importing-vitest-globals'
export type MESSAGE_IDS = 'noImportingVitestGlobals'
export type Options = []

const DISALLOWED_IMPORTS = new Set([
  'describe',
  'it',
  'test',
  'beforeAll',
  'afterAll',
  'beforeEach',
  'afterEach',
  'expect',
  'vi',
]);

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow importing Vitest globals',
      recommended: false
    },
    messages: {
      noImportingVitestGlobals: "Do not import '{{name}}' from 'vitest'. Use globals configuration instead.",
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

        for (const specifier of node.specifiers) {
          if (specifier.type !== 'ImportSpecifier') {
            continue;
          }

          if (specifier.imported.type !== 'Identifier') {
            continue;
          }

          const importedName = specifier.imported.name;
          if (!DISALLOWED_IMPORTS.has(importedName)) {
            continue;
          }

          context.report({
            node,
            messageId: 'noImportingVitestGlobals',
            data: {
              name: importedName,
            },
            fix(fixer: TSESLint.RuleFixer) {
              const specifiers = node.specifiers;
              
              // If this is the only specifier, remove the entire import
              if (specifiers.length === 1) {
                return fixer.remove(node);
              }

              return null;
            }
          });
        }
      }
    }
  }
})
