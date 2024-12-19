import { AST_NODE_TYPES, AST_TOKEN_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils'
import { createRequire } from 'node:module'
import { MaybeTypeCast, TSTypeCastExpression } from './types'

const require = createRequire(import.meta.url)
const eslintRequire = createRequire(require.resolve('eslint'))

export const espreeParser = eslintRequire.resolve('espree')

// We'll only verify nodes with these parent types
const STATEMENT_LIST_PARENTS = new Set([
  AST_NODE_TYPES.Program,
  AST_NODE_TYPES.BlockStatement,
  AST_NODE_TYPES.SwitchCase,
  AST_NODE_TYPES.SwitchStatement
])

export const isValidParent = (parentType: AST_NODE_TYPES): boolean => {
  return STATEMENT_LIST_PARENTS.has(parentType)
}

export const isTokenASemicolon = (token: TSESTree.Token): boolean =>
  token.value === ';' && token.type === AST_TOKEN_TYPES.Punctuator

/**
 * Gets the actual last token.
 *
 * If a semicolon is semicolon-less style's semicolon, this ignores it.
 * For example:
 *
 *     foo()
 *     ;[1, 2, 3].forEach(bar)
 */
export const getActualLastToken = (sourceCode: TSESLint.SourceCode, node: TSESTree.Node): TSESTree.Token => {
  const semiToken = sourceCode.getLastToken(node)!
  const prevToken = sourceCode.getTokenBefore(semiToken)!
  const nextToken = sourceCode.getTokenAfter(semiToken)

  const isSemicolonLessStyle = Boolean(
    prevToken
    && nextToken
    && prevToken.range[0] >= node.range[0]
    && isTokenASemicolon(semiToken)
    && semiToken.loc.start.line !== prevToken.loc.end.line
    && semiToken.loc.end.line === nextToken.loc.start.line
  )

  return isSemicolonLessStyle ? prevToken : semiToken
}

export const getPaddingLineSequences = (prevNode: TSESTree.Node, nextNode: TSESTree.Node, sourceCode: TSESLint.SourceCode) => {
  const pairs: TSESTree.Token[][] = []
  const includeComments = true

  let prevToken = getActualLastToken(sourceCode, prevNode)

  if ((nextNode.loc.start.line - prevNode.loc.end.line) >= 2) {
    do {
      const token = sourceCode.getTokenAfter(prevToken, { includeComments }) as TSESTree.Token

      if ((token.loc.start.line - prevToken.loc.end.line) >= 2) {
        pairs.push([prevToken, token])
      }

      prevToken = token
    } while (prevToken.range[0] < nextNode.range[0])
  }

  return pairs
}

export const areTokensOnSameLine = (
  left: TSESTree.Node | TSESTree.Token,
  right: TSESTree.Node | TSESTree.Token
): boolean => left.loc.end.line === right.loc.start.line

const isTypeCastExpression = <Expression extends TSESTree.Expression>(
  node: MaybeTypeCast<Expression>
): node is TSTypeCastExpression<Expression> =>
  node.type === AST_NODE_TYPES.TSAsExpression
  || node.type === AST_NODE_TYPES.TSTypeAssertion

export const followTypeAssertionChain = <
  Expression extends TSESTree.Expression
>(
  expression: MaybeTypeCast<Expression>
): Expression =>
  isTypeCastExpression(expression)
    ? followTypeAssertionChain(expression.expression)
    : expression
