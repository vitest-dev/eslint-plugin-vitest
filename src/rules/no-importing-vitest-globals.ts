import { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { createEslintRule } from '../utils'
import { isVitestGlobalsImportSpecifier, isVitestGlobalsProperty } from '../utils/guards';

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

    const isRequireVitestCall = (node: TSESTree.Expression | null): node is TSESTree.CallExpression => {
      if (
        node?.type !== TSESTree.AST_NODE_TYPES.CallExpression ||
        node.callee.type !== TSESTree.AST_NODE_TYPES.Identifier ||
        node.callee.name !== 'require'
      ) {
        return false;
      }

      const args = node.arguments;
      return (
        args.length === 1 &&
        args[0].type === TSESTree.AST_NODE_TYPES.Literal &&
        args[0].value === 'vitest'
      );
    };

    const isObjectPattern = (node: TSESTree.BindingName): node is TSESTree.ObjectPattern => {
      return node.type === TSESTree.AST_NODE_TYPES.ObjectPattern;
    };

    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        if (node.source.value !== 'vitest') {
          return;
        }

        for (const specifier of node.specifiers) {
          if(!isVitestGlobalsImportSpecifier(specifier)) {
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
                return removeDeclarator(fixer, node);
              }

              // If all properties are disallowed, remove the entire declarator
              const allDisallowed = properties.every(p => isVitestGlobalsProperty(p));
              if (allDisallowed) {
                return removeDeclarator(fixer, node);
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
