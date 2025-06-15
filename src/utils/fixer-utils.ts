import { TSESTree, TSESLint } from '@typescript-eslint/utils'

export const removeVariableDeclarator = (
  fixer: TSESLint.RuleFixer,
  node: TSESTree.VariableDeclarator,
) => {
  const variableDeclaration = node.parent
  const declarators = variableDeclaration.declarations
  if (declarators.length === 1) {
    return fixer.remove(variableDeclaration)
  }

  const declaratorIndex = declarators.findIndex(
    (dec) => dec.range[0] === node.range[0] && dec.range[1] === node.range[1],
  )
  if (declaratorIndex === 0) {
    // First declarator: remove it and the following comma
    const nextDeclarator = declarators[1]
    return fixer.removeRange([node.range[0], nextDeclarator.range[0]])
  } else {
    // Not first: remove the previous comma and this declarator
    const prevDeclarator = declarators[declaratorIndex - 1]
    return fixer.removeRange([prevDeclarator.range[1], node.range[1]])
  }
}

export const removeNodeFromArray = (
  fixer: TSESLint.RuleFixer,
  nodes: TSESTree.Node[],
  target: TSESTree.Node,
): TSESLint.RuleFix => {
  const index = nodes.indexOf(target)
  if (index === -1) {
    throw new Error('Target node not found in nodes array')
  }

  if (index === 0) {
    // Remove first node and the following comma
    const next = nodes[1]
    return fixer.removeRange([target.range[0], next.range[0]])
  } else {
    // Remove preceding comma and the target node
    const prev = nodes[index - 1]
    return fixer.removeRange([prev.range[1], target.range[1]])
  }
}
