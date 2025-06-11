import { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { createEslintRule } from '../utils'

export const RULE_NAME = 'no-importing-vitest-globals';
export type MESSAGE_IDS = 'noImportingVitestGlobals' | 'noRequiringVitestGlobals';
export type Options = [];

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
      noRequiringVitestGlobals: "Do not require '{{name}}' from 'vitest'. Use globals configuration instead."
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

    const checkProperty = (prop: TSESTree.Property | TSESTree.RestElement) => {
      if (prop.type !== 'Property') {
        return { isValid: true };
      }

      if (prop.key.type !== 'Identifier') {
        return { isValid: true };
      }

      const propertyName = prop.key.name;
      if (!DISALLOWED_IMPORTS.has(propertyName)) {
        return { isValid: true };
      }

      return { isValid: false, propertyName };
    };

    const removeDeclarator = (fixer: TSESLint.RuleFixer, node: TSESTree.VariableDeclarator) => {
      const variableDeclaration = node.parent;
      const declarators = variableDeclaration.declarations;
      if (declarators.length === 1) {
        return fixer.remove(variableDeclaration);
      }

      const declaratorIndex = declarators.findIndex(
        (decl) => decl.range[0] === node.range[0] && decl.range[1] === node.range[1]
      );
      if (declaratorIndex === 0) {
        // First declarator: remove it and the following comma
        const nextDeclarator = declarators[1];
        return fixer.removeRange([node.range[0], nextDeclarator.range[0]]);
      } else {
        // Not first: remove the previous comma and this declarator
        const prevDeclarator = declarators[declaratorIndex - 1];
        return fixer.removeRange([prevDeclarator.range[1], node.range[1]]);
      }
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
      },
      VariableDeclarator(node: TSESTree.VariableDeclarator) {
        if (!node.init) {
          return;
        }

        if (node.init.type !== 'CallExpression') {
          return;
        }

        if (node.init.callee.type !== 'Identifier') {
          return;
        }

        if (node.init.callee.name !== 'require') {
          return;
        }

        if (node.init.arguments.length !== 1) {
          return;
        }

        if (node.init.arguments[0].type !== 'Literal') {
          return;
        }

        if (node.init.arguments[0].value !== 'vitest') {
          return;
        }

        if (node.id.type !== 'ObjectPattern') {
          return;
        }

        const properties = node.id.properties;
        for (const prop of properties) {
          const { isValid, propertyName } = checkProperty(prop);
          if (isValid) {
            continue;
          }

          context.report({
            node: prop,
            messageId: 'noRequiringVitestGlobals',
            data: {
              name: propertyName
            },
            fix(fixer) {
              if (properties.length === 1) {
                return removeDeclarator(fixer, node);
              }

              // If all specifiers are disallowed, remove the entire import
              const allDisallowed = properties.every(p => {
                const { isValid } = checkProperty(p);
                return !isValid;
              });
              if (allDisallowed) {
                return fixer.remove(node);
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
