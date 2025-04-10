import { TSESLint, TSESTree } from '@typescript-eslint/utils'
import { Scope } from '@typescript-eslint/utils/ts-eslint'

export function getScope(
  context: TSESLint.RuleContext<string, unknown[]>,
  node: TSESTree.Node
): Scope.Scope {
  return context.sourceCode.getScope
    ? context.sourceCode.getScope(node)
    : context.getScope()
}

export function getModuleScope(
  context: TSESLint.RuleContext<string, unknown[]>,
  node: TSESTree.Node
): Scope.Scope | null {
  let scope: Scope.Scope | null = getScope(context, node)

  while (scope) {
    if (scope.type === 'module') {
      return scope
    }
    scope = scope.upper
  }

  return scope
}
