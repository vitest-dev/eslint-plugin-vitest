// Imported from https://github.com/dangreenisrael/eslint-plugin-jest-formatting/blob/master/src/rules/padding.ts
// Original license: https://github.com/dangreenisrael/eslint-plugin-jest-formatting/blob/master/LICENSE

import { createEslintRule } from '.'
import {
  AST_NODE_TYPES,
  AST_TOKEN_TYPES,
  TSESLint,
  TSESTree,
} from '@typescript-eslint/utils'
import * as astUtils from './ast-utils'

export const enum PaddingType {
  Any,
  Always,
}

export const enum StatementType {
  Any,
  AfterAllToken,
  AfterEachToken,
  BeforeAllToken,
  BeforeEachToken,
  DescribeToken,
  ExpectToken,
  ExpectTypeOfToken,
  FdescribeToken,
  FitToken,
  ItToken,
  TestToken,
  XdescribeToken,
  XitToken,
  XtestToken,
}

export interface Config {
  paddingType: PaddingType
  prevStatementType: StatementType | StatementType[]
  nextStatementType: StatementType | StatementType[]
}

interface ScopeInfo {
  prevNode: TSESTree.Node | null
  enter: () => void
  exit: () => void
}

// Tracks position in scope and prevNode. Used to compare current and prev node
// and then to walk back up to the parent scope or down into the next one.
// And so on...
interface Scope {
  upper: Scope | null
  prevNode: TSESTree.Node | null
}

type PaddingTester = (
  prevNode: TSESTree.Node,
  nextNode: TSESTree.Node,
  paddingContext: PaddingContext,
) => void

interface PaddingContext {
  ruleContext: TSESLint.RuleContext<'missingPadding', unknown[]>
  sourceCode: TSESLint.SourceCode
  scopeInfo: ScopeInfo
  configs: Config[]
}

const paddingAlwaysTester = (
  prevNode: TSESTree.Node,
  nextNode: TSESTree.Node,
  paddingContext: PaddingContext,
): void => {
  const { sourceCode, ruleContext } = paddingContext

  const paddingLines = astUtils.getPaddingLineSequences(
    prevNode,
    nextNode,
    sourceCode,
  )

  if (paddingLines.length > 0) return

  ruleContext.report({
    node: nextNode,
    messageId: 'missingPadding',
    fix(fixer: TSESLint.RuleFixer) {
      let prevToken = astUtils.getActualLastToken(sourceCode, prevNode)
      const nextToken = (sourceCode.getFirstTokenBetween(prevToken, nextNode, {
        includeComments: true,
        /**
         * Skip the trailing comments of the previous node.
         * This inserts a blank line after the last trailing comment.
         *
         * For example:
         *
         *     foo(); // trailing comment.
         *     // comment.
         *     bar();
         *
         * Get fixed to:
         *
         *     foo(); // trailing comment.
         *
         *     // comment.
         *     bar();
         */
        filter(token: TSESTree.Token): boolean {
          if (astUtils.areTokensOnSameLine(prevToken, token)) {
            prevToken = token

            return false
          }

          return true
        },
      }) || nextNode) as TSESTree.Token

      const insertText = astUtils.areTokensOnSameLine(prevToken, nextToken)
        ? '\n\n'
        : '\n'

      return fixer.insertTextAfter(prevToken, insertText)
    },
  })
}

// A mapping of PaddingType to PaddingTester
const paddingTesters: { [T in PaddingType]: PaddingTester } = {
  [PaddingType.Any]: () => true,
  [PaddingType.Always]: paddingAlwaysTester,
}

const createScopeInfo = (): ScopeInfo => {
  let scope: Scope | null = null

  return {
    get prevNode() {
      return scope!.prevNode
    },
    set prevNode(node) {
      scope!.prevNode = node
    },
    enter() {
      scope = { upper: scope, prevNode: null }
    },
    exit() {
      scope = scope!.upper
    },
  }
}

const createTokenTester = (tokenName: string): StatementTester => {
  return (node: TSESTree.Node, sourceCode: TSESLint.SourceCode): boolean => {
    let activeNode = node

    if (activeNode.type === AST_NODE_TYPES.ExpressionStatement) {
      // In the case of `await`, we actually care about its argument
      if (activeNode.expression.type === AST_NODE_TYPES.AwaitExpression) {
        activeNode = activeNode.expression.argument
      }

      const token = sourceCode.getFirstToken(activeNode)

      return (
        token?.type === AST_TOKEN_TYPES.Identifier && token.value === tokenName
      )
    }

    return false
  }
}

type StatementTester = (
  node: TSESTree.Node,
  sourceCode: TSESLint.SourceCode,
) => boolean

type StatementTypes = StatementType | StatementType[]

// A mapping of StatementType to StatementTester for... testing statements
const statementTesters: { [T in StatementType]: StatementTester } = {
  [StatementType.Any]: () => true,
  [StatementType.AfterAllToken]: createTokenTester('afterAll'),
  [StatementType.AfterEachToken]: createTokenTester('afterEach'),
  [StatementType.BeforeAllToken]: createTokenTester('beforeAll'),
  [StatementType.BeforeEachToken]: createTokenTester('beforeEach'),
  [StatementType.DescribeToken]: createTokenTester('describe'),
  [StatementType.ExpectToken]: createTokenTester('expect'),
  [StatementType.ExpectTypeOfToken]: createTokenTester('expectTypeOf'),
  [StatementType.FdescribeToken]: createTokenTester('fdescribe'),
  [StatementType.FitToken]: createTokenTester('fit'),
  [StatementType.ItToken]: createTokenTester('it'),
  [StatementType.TestToken]: createTokenTester('test'),
  [StatementType.XdescribeToken]: createTokenTester('xdescribe'),
  [StatementType.XitToken]: createTokenTester('xit'),
  [StatementType.XtestToken]: createTokenTester('xtest'),
}

/**
 * Check whether the given node matches the statement type
 */
const nodeMatchesType = (
  node: TSESTree.Node,
  statementType: StatementTypes,
  paddingContext: PaddingContext,
): boolean => {
  let innerStatementNode = node
  const { sourceCode } = paddingContext

  // Dig into LabeledStatement body until it's not that anymore
  while (innerStatementNode.type === AST_NODE_TYPES.LabeledStatement) {
    innerStatementNode = innerStatementNode.body
  }

  // If it's an array recursively check if any of the statement types match
  // the node
  if (Array.isArray(statementType)) {
    return statementType.some((type) =>
      nodeMatchesType(innerStatementNode, type, paddingContext),
    )
  }

  return statementTesters[statementType](innerStatementNode, sourceCode)
}

const testPadding = (
  prevNode: TSESTree.Node,
  nextNode: TSESTree.Node,
  paddingContext: PaddingContext,
): void => {
  const { configs } = paddingContext

  const testType = (type: PaddingType) =>
    paddingTesters[type](prevNode, nextNode, paddingContext)

  for (let i = configs.length - 1; i >= 0; --i) {
    const {
      prevStatementType: prevType,
      nextStatementType: nextType,
      paddingType,
    } = configs[i]

    if (
      nodeMatchesType(prevNode, prevType, paddingContext) &&
      nodeMatchesType(nextNode, nextType, paddingContext)
    ) {
      return testType(paddingType)
    }
  }

  return testType(PaddingType.Any)
}

const verifyNode = (
  node: TSESTree.Node,
  paddingContext: PaddingContext,
): void => {
  const { scopeInfo } = paddingContext

  if (node.parent && !astUtils.isValidParent(node.parent.type)) return

  if (scopeInfo.prevNode) {
    testPadding(scopeInfo.prevNode, node, paddingContext)
  }

  scopeInfo.prevNode = node
}

/**
 * Creates an ESLint rule for a given set of padding Config objects.
 *
 * The algorithm is approximately this:
 *
 * For each 'scope' in the program
 * - Enter the scope (store the parent scope and previous node)
 * - For each statement in the scope
 *   - Check the current node and previous node against the Config objects
 *   - If the current node and previous node match a Config, check the padding.
 *     Otherwise, ignore it.
 *   - If the padding is missing (and required), report and fix
 *   - Store the current node as the previous
 *   - Repeat
 * - Exit scope (return to parent scope and clear previous node)
 *
 * The items we're looking for with this rule are ExpressionStatement nodes
 * where the first token is an Identifier with a name matching one of the vitest
 * functions. It's not foolproof, of course, but it's probably good enough for
 * almost all cases.
 *
 * The Config objects specify a padding type, a previous statement type, and a
 * next statement type. Wildcard statement types and padding types are
 * supported. The current node and previous node are checked against the
 * statement types. If they match then the specified padding type is
 * tested/enforced.
 */
export const createPaddingRule = (
  name: string,
  description: string,
  configs: Config[],
  deprecated = false,
) => {
  return createEslintRule({
    name,
    meta: {
      docs: { description },
      fixable: 'whitespace',
      deprecated,
      messages: {
        missingPadding: 'expect blank line before this statement',
      },
      schema: [],
      type: 'suggestion',
    },
    defaultOptions: [],
    create(context) {
      const paddingContext = {
        ruleContext: context,
        sourceCode: context.sourceCode ?? context.getSourceCode(),
        scopeInfo: createScopeInfo(),
        configs,
      }

      const { scopeInfo } = paddingContext

      return {
        Program: scopeInfo.enter,
        'Program:exit': scopeInfo.exit,
        BlockStatement: scopeInfo.enter,
        'BlockStatement:exit': scopeInfo.exit,
        SwitchStatement: scopeInfo.enter,
        'SwitchStatement:exit': scopeInfo.exit,
        ':statement': (node: TSESTree.Node) => verifyNode(node, paddingContext),
        SwitchCase(node: TSESTree.Node) {
          verifyNode(node, paddingContext)
          scopeInfo.enter()
        },
        'SwitchCase:exit': scopeInfo.exit,
      }
    },
  })
}
