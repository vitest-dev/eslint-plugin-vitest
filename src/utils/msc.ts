import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { getFirstMatcherArg, ParsedExpectVitestFnCall } from './parse-vitest-fn-call'
import { EqualityMatcher } from './types'
import { getAccessorValue, isSupportedAccessor } from '.'
import { basename, parse } from "node:path";
import { fileURLToPath } from 'node:url';

export const isBooleanLiteral = (node: TSESTree.Node): node is TSESTree.BooleanLiteral =>
  node.type === AST_NODE_TYPES.Literal && typeof node.value === 'boolean'

/**
 * Checks if the given `ParsedExpectMatcher` is either a call to one of the equality matchers,
 * with a boolean` literal as the sole argument, *or* is a call to `toBeTruthy` or `toBeFalsy`.
 */
export const isBooleanEqualityMatcher = (
  expectFnCall: ParsedExpectVitestFnCall
): boolean => {
  const matcherName = getAccessorValue(expectFnCall.matcher)

  if (['toBeTruthy', 'toBeFalsy'].includes(matcherName))
    return true

  if (expectFnCall.args.length !== 1)
    return false

  const arg = getFirstMatcherArg(expectFnCall)

  return EqualityMatcher.hasOwnProperty(matcherName) && isBooleanLiteral(arg)
}

export const isInstanceOfBinaryExpression = (
  node: TSESTree.Node,
  className: string
): node is TSESTree.BinaryExpression =>
  node.type === AST_NODE_TYPES.BinaryExpression
  && node.operator === 'instanceof'
  && isSupportedAccessor(node.right, className)

export interface CallExpressionWithSingleArgument<
  Argument extends TSESTree.CallExpression['arguments'][number] = TSESTree.CallExpression['arguments'][number]
> extends TSESTree.CallExpression {
  arguments: [Argument]
}

export const hasOnlyOneArgument = (
  call: TSESTree.CallExpression
): call is CallExpressionWithSingleArgument => call.arguments.length === 1


export function get_filename(url: string) {
  return parse(basename(fileURLToPath(url))).name
}
