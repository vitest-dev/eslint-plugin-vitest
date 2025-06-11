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
    const checkSpecifier = (specifier: TSESTree.ImportClause) => {
      if (specifier.type !== 'ImportSpecifier') {
        return { isValid: true };
      }

      if (specifier.imported.type !== 'Identifier') {
        return { isValid: true };
      }

      const importedName = specifier.imported.name;
      if (!DISALLOWED_IMPORTS.has(importedName)) {
        return { isValid: true };
      }

      return { isValid: false, importedName };
    }

    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        if (node.source.value !== 'vitest') {
          return;
        }

        for (const specifier of node.specifiers) {
          const { isValid, importedName } = checkSpecifier(specifier);
          if (isValid) {
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

              // If all specifiers are disallowed, remove the entire import
              const allDisallowed = specifiers.every(spec => {
                const { isValid } = checkSpecifier(spec);
                return !isValid;
              });
              if (allDisallowed) {
                return fixer.remove(node);
              }

              const specifierIndex = specifiers.indexOf(specifier);
              if (specifierIndex === 0) {
                // First specifier: remove it and the following comma
                const nextSpecifier = specifiers[1];
                return fixer.removeRange([specifier.range[0], nextSpecifier.range[0]]);
              } else {
                // Not first specifier: remove preceding comma and the specifier
                const prevSpecifier = specifiers[specifierIndex - 1];
                return fixer.removeRange([prevSpecifier.range[1], specifier.range[1]]);
              }
            }
          });
        }
      }
    }
  }
})
