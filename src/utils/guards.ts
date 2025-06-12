import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { VITEST_GLOBALS } from "./valid-vitest-globals";

export const isVitestImport = (node: TSESTree.ImportDeclaration): boolean => {
  return node.source.value === 'vitest';
}

export const isVitestGlobalsImportSpecifier = (specifier: TSESTree.ImportClause): specifier is TSESTree.ImportSpecifier & { imported: TSESTree.Identifier } => {
  return (
    specifier.type === AST_NODE_TYPES.ImportSpecifier &&
    specifier.imported.type === AST_NODE_TYPES.Identifier &&
    VITEST_GLOBALS.has(specifier.imported.name)
  );
}

export const isVitestGlobalsProperty = (prop: TSESTree.Property | TSESTree.RestElement): prop is TSESTree.Property & { key: TSESTree.Identifier } => {
  return (
    prop.type === AST_NODE_TYPES.Property &&
    prop.key.type === AST_NODE_TYPES.Identifier &&
    VITEST_GLOBALS.has(prop.key.name)
  );
};

export const isRequireVitestCall = (node: TSESTree.Expression | null): node is TSESTree.CallExpression => {
  if (
    node?.type !== AST_NODE_TYPES.CallExpression ||
    node.callee.type !== AST_NODE_TYPES.Identifier ||
    node.callee.name !== 'require'
  ) {
    return false;
  }

  const args = node.arguments;
  return (
    args.length === 1 &&
    args[0].type === AST_NODE_TYPES.Literal &&
    args[0].value === 'vitest'
  );
};

export const isObjectPattern = (node: TSESTree.BindingName): node is TSESTree.ObjectPattern => {
  return node.type === AST_NODE_TYPES.ObjectPattern;
};
