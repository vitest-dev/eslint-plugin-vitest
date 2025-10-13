import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getAccessorValue } from '../utils'
import {
  ParsedExpectVitestFnCall,
  parseVitestFnCall,
} from '../utils/parse-vitest-fn-call'
import { SourceCode } from '@typescript-eslint/utils/ts-eslint'

type MESSAGE_IDS = 'preferCalledExactlyOnceWith'
export const RULE_NAME = 'prefer-called-exactly-once-with'
type Options = []

const MATCHERS_TO_COMBINE = [
  'toHaveBeenCalledOnce',
  'toHaveBeenCalledWith',
] as const

const MOCK_CALL_RESET_METHODS = ['mockClear', 'mockReset', 'mockRestore'] as const

type CombinedMatcher = (typeof MATCHERS_TO_COMBINE)[number]

type MatcherReference = {
  matcherName: CombinedMatcher
  callExpression: TSESTree.CallExpression
}

const hasMatchersToCombine = (target: string): target is CombinedMatcher =>
  MATCHERS_TO_COMBINE.some((matcher) => matcher === target)

const getExpectText = (
  callee: TSESTree.Expression,
  source: Readonly<SourceCode>,
) => {
  if (callee.type !== AST_NODE_TYPES.MemberExpression) return null

  return source.getText(callee.object)
}

const getArgumentsText = (
  callExpression: TSESTree.CallExpression,
  source: Readonly<SourceCode>,
) => callExpression.arguments.map((arg) => source.getText(arg)).join(', ')

const getValidExpectCall = (
  vitestFnCall: ReturnType<typeof parseVitestFnCall>,
): ParsedExpectVitestFnCall | null => {
  if (vitestFnCall?.type !== 'expect') return null
  if (
    vitestFnCall.modifiers.some(
      (modifier) => getAccessorValue(modifier) === 'not',
    )
  )
    return null

  return vitestFnCall
}

const getMatcherName = (vitestFnCall: ReturnType<typeof parseVitestFnCall>) => {
  const validExpectCall = getValidExpectCall(vitestFnCall)
  return validExpectCall ? getAccessorValue(validExpectCall.matcher) : null
}

const getExpectArgText = ({ callee }: TSESTree.CallExpression) => {
  if (callee.type !== AST_NODE_TYPES.MemberExpression) return null
  const { object } = callee
  if (object.type !== AST_NODE_TYPES.CallExpression) return null

  const [firstArgument] = object.arguments
  if (firstArgument.type !== AST_NODE_TYPES.Identifier) return null

  return firstArgument.name
}

const getSharedExpectArgText = (
  firstCallExpression: TSESTree.CallExpression,
  secondCallExpression: TSESTree.CallExpression,
) => {
  const firstArgText = getExpectArgText(firstCallExpression)
  if (!firstArgText) return null
  const secondArgText = getExpectArgText(secondCallExpression)
  if (firstArgText !== secondArgText) return null

  return firstArgText
}

const isTargetMockResetCall = (
  statement: TSESTree.Statement,
  expectArgText: string,
  minLine: number,
  maxLine: number,
) => {
  if (statement.type !== AST_NODE_TYPES.ExpressionStatement) return false
  if (statement.expression.type !== AST_NODE_TYPES.CallExpression) return false

  const statementLine = statement.loc.start.line
  if (statementLine <= minLine || statementLine >= maxLine) return false

  const { callee } = statement.expression
  if (callee.type !== AST_NODE_TYPES.MemberExpression) return false

  const { object, property } = callee
  if (object.type !== AST_NODE_TYPES.Identifier) return false
  if (object.name !== expectArgText) return false
  if (property.type !== AST_NODE_TYPES.Identifier) return false

  return MOCK_CALL_RESET_METHODS.some((method) => method === property.name)
}

const hasMockResetBetween = (
  body: TSESTree.Statement[],
  firstCallExpression: TSESTree.CallExpression,
  secondCallExpression: TSESTree.CallExpression,
): boolean => {
  const firstLine = firstCallExpression.loc.start.line
  const secondLine = secondCallExpression.loc.start.line
  const [minLine, maxLine] =
    firstLine < secondLine ? [firstLine, secondLine] : [secondLine, firstLine]

  const expectArgText = getSharedExpectArgText(
    firstCallExpression,
    secondCallExpression,
  )
  if (!expectArgText) return false

  return body.some((statement) =>
    isTargetMockResetCall(statement, expectArgText, minLine, maxLine),
  )
}

const getMemberProperty = (expression: TSESTree.CallExpression) =>
  expression.callee.type === AST_NODE_TYPES.MemberExpression
    ? expression.callee.property
    : null

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        'Prefer `toHaveBeenCalledExactlyOnceWith` over `toHaveBeenCalledOnce` and `toHaveBeenCalledWith`',
    },
    messages: {
      preferCalledExactlyOnceWith:
        'Prefer {{matcherName}} (/* expected args */)',
    },
    type: 'suggestion',
    fixable: 'code',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { sourceCode } = context

    const getCallExpressions = (
      body: TSESTree.Statement[],
    ): TSESTree.CallExpression[] =>
      body
        .filter((node) => node.type === AST_NODE_TYPES.ExpressionStatement)
        .flatMap((node) =>
          node.expression.type === AST_NODE_TYPES.CallExpression
            ? node.expression
            : [],
        )

    const checkBlockBody = (body: TSESTree.Statement[]) => {
      const callExpressions = getCallExpressions(body)
      const expectMatcherMap = new Map<string, Readonly<MatcherReference>[]>()

      for (const callExpression of callExpressions) {
        const matcherName = getMatcherName(
          parseVitestFnCall(callExpression, context),
        )
        const expectedText = getExpectText(callExpression.callee, sourceCode)
        if (!matcherName || !hasMatchersToCombine(matcherName) || !expectedText)
          continue

        const existingNodes = expectMatcherMap.get(expectedText) ?? []
        const newTargetNodes = [
          ...existingNodes,
          { matcherName, callExpression },
        ] as const satisfies MatcherReference[]
        expectMatcherMap.set(expectedText, newTargetNodes)
      }

      for (const [
        expectedText,
        matcherReferences,
      ] of expectMatcherMap.entries()) {
        if (matcherReferences.length !== 2) continue

        const targetArgNode = matcherReferences.find(
          (reference) => reference.matcherName === 'toHaveBeenCalledWith',
        )
        if (!targetArgNode) continue

        const argsText = getArgumentsText(
          targetArgNode.callExpression,
          sourceCode,
        )

        const [firstMatcherReference, secondMatcherReference] =
          matcherReferences
        const targetNode = getMemberProperty(
          secondMatcherReference.callExpression,
        )
        if (!targetNode) continue

        const { callExpression: firstCallExpression } = firstMatcherReference
        const { callExpression: secondCallExpression, matcherName } =
          secondMatcherReference

        if (
          hasMockResetBetween(body, firstCallExpression, secondCallExpression)
        )
          continue

        context.report({
          messageId: 'preferCalledExactlyOnceWith',
          node: targetNode,
          data: { matcherName },
          fix(fixer) {
            const indentation = sourceCode.text.slice(
              firstCallExpression.parent.range[0],
              firstCallExpression.range[0],
            )
            const replacement = `${indentation}${expectedText}.toHaveBeenCalledExactlyOnceWith(${argsText})`

            const lineStart = sourceCode.getIndexFromLoc({
              line: secondCallExpression.parent.loc.start.line,
              column: 0,
            })
            const lineEnd = sourceCode.getIndexFromLoc({
              line: secondCallExpression.parent.loc.end.line + 1,
              column: 0,
            })
            return [
              fixer.replaceText(firstCallExpression, replacement),
              fixer.removeRange([lineStart, lineEnd]),
            ]
          },
        })
      }
    }

    return {
      Program(node) {
        checkBlockBody(node.body)
      },
      BlockStatement(node) {
        checkBlockBody(node.body)
      },
    }
  },
})
