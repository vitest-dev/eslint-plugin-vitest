import { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { createEslintRule } from '../utils'
import { isObjectPattern, isRequireVitestCall, isVitestGlobalsImportSpecifier, isVitestGlobalsProperty, isVitestImport } from '../utils/guards';
import { removeVariableDeclarator } from '../utils/variable-declarator-utils';

export const RULE_NAME = 'no-importing-vitest-globals';
export type MESSAGE_IDS = 'noImportingVitestGlobals' | 'noRequiringVitestGlobals';
export type Options = [];

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
      noRequiringVitestGlobals: "Do not require '{{name}}' from 'vitest'. Use globals configuration instead."
    },
    fixable: 'code',
    schema: []
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        if (!isVitestImport(node)) return;

        for (const specifier of node.specifiers) {
          if (!isVitestGlobalsImportSpecifier(specifier)) {
            continue;
          }

          context.report({
            node: specifier,
            messageId: 'noImportingVitestGlobals',
            data: {
              name: specifier.imported.name,
            },
            fix(fixer: TSESLint.RuleFixer) {
              const specifiers = node.specifiers;

              // If this is the only specifier, remove the entire import
              if (specifiers.length === 1) {
                return fixer.remove(node);
              }

              // If all specifiers are disallowed, remove the entire import
              const allDisallowed = specifiers.every(spec => isVitestGlobalsImportSpecifier(spec));
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
      },
      VariableDeclarator(node: TSESTree.VariableDeclarator) {
        if (!isRequireVitestCall(node.init)) return;
        if (!isObjectPattern(node.id)) return;

        const properties = node.id.properties;
        for (const prop of properties) {
          if (!isVitestGlobalsProperty(prop)) {
            continue;
          }

          context.report({
            node: prop,
            messageId: 'noRequiringVitestGlobals',
            data: {
              name: prop.key.name,
            },
            fix(fixer) {
              if (properties.length === 1) {
                return removeVariableDeclarator(fixer, node);
              }

              // If all properties are disallowed, remove the entire declarator
              const allDisallowed = properties.every(p => isVitestGlobalsProperty(p));
              if (allDisallowed) {
                return removeVariableDeclarator(fixer, node);
              }

              const propIndex = properties.indexOf(prop);
              if (propIndex === 0) {
                // First property: remove it and the following comma
                const nextProp = properties[1];
                return fixer.removeRange([prop.range[0], nextProp.range[0]]);
              } else {
                // Not first property: remove preceding comma and the property
                const prevProp = properties[propIndex - 1];
                return fixer.removeRange([prevProp.range![1], prop.range![1]]);
              }
            }
          });
        }
      },
    }
  }
})
