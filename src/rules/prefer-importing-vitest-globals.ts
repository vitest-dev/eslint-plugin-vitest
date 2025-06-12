import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { createEslintRule } from "../utils";
import { VITEST_GLOBALS } from "../utils/valid-vitest-globals";
import { isObjectPattern, isRequireVitestCall, isVitestGlobalsImportSpecifier, isVitestGlobalsProperty, isVitestImport } from "../utils/guards";

export const RULE_NAME = 'prefer-importing-vitest-globals';
export type MESSAGE_IDS = 'preferImportingVitestGlobals';
export type Options = [];

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Detect usage of Vitest globals without importing them',
      recommended: false,
    },
    messages: {
      preferImportingVitestGlobals: "Import '{{name}}' from 'vitest'",
    },
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    const importedNames = new Set<string>();

    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        if (!isVitestImport(node)) return;

        const specifiers = node.specifiers;
        for (const specifier of specifiers) {
          if (isVitestGlobalsImportSpecifier(specifier)) {
            const importedName = specifier.imported.name;
            importedNames.add(importedName);
          }
        }
      },
      VariableDeclarator(node: TSESTree.VariableDeclarator) {
        if (!isRequireVitestCall(node.init)) return;
        if (!isObjectPattern(node.id)) return;

        const properties = node.id.properties;
        for (const prop of properties) {
          if (isVitestGlobalsProperty(prop)) {
            const importedName = prop.key.name;
            importedNames.add(importedName);
          }
        }
      },
      CallExpression(node: TSESTree.CallExpression) {
        if (
          node.callee.type !== AST_NODE_TYPES.Identifier ||
          !VITEST_GLOBALS.has(node.callee.name)
        ) {
          return;
        }

        if (importedNames.has(node.callee.name)) {
          return;
        }

        const name = node.callee.name;
        context.report({
          node: node.callee,
          messageId: 'preferImportingVitestGlobals',
          data: { name },
          fix(fixer) {
            const program = context.sourceCode.ast;

            const vitestImport = program.body.find(
              (n): n is TSESTree.ImportDeclaration =>
                n.type === AST_NODE_TYPES.ImportDeclaration &&
                n.source.value === 'vitest'
            );

            if (!vitestImport) {
              return fixer.insertTextBefore(program.body[0], `import { ${name} } from 'vitest';\n`);
            }

            const namespaceImport = vitestImport.specifiers.find(s => s.type === 'ImportNamespaceSpecifier');
            if (namespaceImport) {
              return fixer.insertTextBefore(program.body[0], `import { ${name} } from 'vitest';\n`);
            }

            const defaultImport = vitestImport.specifiers.find(s => s.type === 'ImportDefaultSpecifier');
            if (defaultImport) {
              return fixer.insertTextAfter(defaultImport!, `, { ${name} }`);
            }

            const lastSpecifier = vitestImport.specifiers[vitestImport.specifiers.length - 1];
            return fixer.insertTextAfter(lastSpecifier, `, ${name}`);
          }
        });
      },
    };
  },
});
