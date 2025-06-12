import { TSESTree, TSESLint } from "@typescript-eslint/utils";

export const removeVariableDeclarator = (fixer: TSESLint.RuleFixer, node: TSESTree.VariableDeclarator) => {
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
