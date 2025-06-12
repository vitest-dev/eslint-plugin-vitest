import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

export const findVitestImport = (program: TSESTree.Program): TSESTree.ImportDeclaration | undefined => {
  return program.body.find(
    (n): n is TSESTree.ImportDeclaration =>
      n.type === AST_NODE_TYPES.ImportDeclaration &&
      n.source.value === 'vitest'
  );
}
