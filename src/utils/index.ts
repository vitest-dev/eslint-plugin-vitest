// MIT License
// Copyright (c) 2018 Jonathan Kim
// Imported from https://github.com/jest-community/eslint-plugin-jest/blob/main/src/rules/utils/accessors.ts#L6
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-use-before-define */
import {
  TSESLint,
  AST_NODE_TYPES,
  ESLintUtils,
  TSESTree
} from '@typescript-eslint/utils'
import {
  KnownMemberExpression,
  ParsedExpectVitestFnCall
} from './parseVitestFnCall'

export const createEslintRule = ESLintUtils.RuleCreator(
  (ruleName) =>
    `https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/${ruleName}.md`
)

export const joinNames = (a: string | null, b: string | null): string | null =>
  a && b ? `${a}.${b}` : null

interface TemplateLiteral<Value extends string = string>
  extends TSESTree.TemplateLiteral {
  quasis: [TSESTree.TemplateElement & { value: { raw: Value; cooked: Value } }];
}
interface StringLiteral<Value extends string = string>
  extends TSESTree.StringLiteral {
  value: Value;
}

export type StringNode<S extends string = string> =
  | StringLiteral<S>
  | TemplateLiteral<S>;

export type FunctionExpression =
  | TSESTree.ArrowFunctionExpression
  | TSESTree.FunctionExpression;

export const isFunction = (node: TSESTree.Node): node is FunctionExpression =>
  node.type === AST_NODE_TYPES.FunctionExpression ||
  node.type === AST_NODE_TYPES.ArrowFunctionExpression

/**
 * An `Identifier` with a known `name` value - i.e `expect`.
 */
interface KnownIdentifier<Name extends string> extends TSESTree.Identifier {
  name: Name;
}

export function getNodeName(node: TSESTree.Node): string | null {
  if (isSupportedAccessor(node)) return getAccessorValue(node)

  switch (node.type) {
    case AST_NODE_TYPES.TaggedTemplateExpression:
      return getNodeName(node.tag)
    case AST_NODE_TYPES.MemberExpression:
      return joinNames(getNodeName(node.object), getNodeName(node.property))
    case AST_NODE_TYPES.NewExpression:
    case AST_NODE_TYPES.CallExpression:
      return getNodeName(node.callee)
  }
  return null
}

export type AccessorNode<Specifics extends string = string> =
  | StringNode<Specifics>
  | KnownIdentifier<Specifics>;

export const isSupportedAccessor = <V extends string>(
  node: TSESTree.Node,
  value?: V
): node is AccessorNode<V> => {
  return isIdentifier(node, value) || isStringNode(node, value)
}

/**
 * Checks if the given `node` is an `Identifier`.
 *
 * If a `name` is provided, & the `node` is an `Identifier`,
 * the `name` will be compared to that of the `identifier`.
 */
export const isIdentifier = <V extends string>(
  node: TSESTree.Node,
  name?: V
): node is KnownIdentifier<V> => {
  return (
    node.type === AST_NODE_TYPES.Identifier &&
    (name === undefined || node.name === name)
  )
}

/**
 * Checks if the given `node` is a `TemplateLiteral`.
 *
 * Complex `TemplateLiteral`s are not considered specific, and so will return `false`.
 *
 * If a `value` is provided & the `node` is a `TemplateLiteral`,
 * the `value` will be compared to that of the `TemplateLiteral`.
 */
const isTemplateLiteral = <V extends string>(
  node: TSESTree.Node,
  value?: V
): node is StringLiteral<V> => {
  return (
    node.type === AST_NODE_TYPES.TemplateLiteral &&
    node.quasis.length === 1 &&
    (value === undefined || node.quasis[0].value.raw === value)
  )
}

/**
 * Checks if the given `node` is a `StringLiteral`.
 *
 * If a `value` is provided & the `node` is a `StringLiteral`,
 * the `value` will be compared to that of the `StringLiteral`.
 */
const isStringLiteral = <V extends string>(
  node: TSESTree.Node,
  value?: V
): node is StringLiteral<V> =>
  node.type === AST_NODE_TYPES.Literal &&
  typeof node.value === 'string' &&
  (value === undefined || node.value === value)

/**
 * Checks if the given `node` is a {@link StringNode}.
 */
export const isStringNode = <V extends string>(
  node: TSESTree.Node,
  specifics?: V
): node is StringNode<V> =>
  isStringLiteral(node, specifics) || isTemplateLiteral(node, specifics)

/**
 * Gets the value of the given `AccessorNode`,
 * account for the different node types.
 */
export const getAccessorValue = <S extends string = string>(
  accessor: AccessorNode<S>
): S =>
  accessor.type === AST_NODE_TYPES.Identifier
    ? accessor.name
    : getStringValue(accessor)

/**
 * Gets the value of the given `StringNode`.
 *
 * If the `node` is a `TemplateLiteral`, the `raw` value is used;
 * otherwise, `value` is returned instead.
 */
export const getStringValue = <S extends string>(node: StringNode<S>): S =>
  node?.type === AST_NODE_TYPES.TemplateLiteral
    ? node.quasis[0].value.raw
    : node?.value

export const replaceAccessorFixer = (
  fixer: TSESLint.RuleFixer,
  node: AccessorNode,
  text: string
) => {
  return fixer.replaceText(
    node,
    node.type === AST_NODE_TYPES.Identifier ? text : `'${text}'`
  )
}

export const removeExtraArgumentsFixer = (
  fixer: TSESLint.RuleFixer,
  context: TSESLint.RuleContext<string, unknown[]>,
  func: TSESTree.CallExpression,
  from: number
): TSESLint.RuleFix => {
  const firstArg = func.arguments[from]
  const lastArg = func.arguments[func.arguments.length - 1]

  const sourceCode = context.getSourceCode()

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let tokenAfterLastParam = sourceCode.getTokenAfter(lastArg)!

  if (tokenAfterLastParam.value === ',')
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    tokenAfterLastParam = sourceCode.getTokenAfter(tokenAfterLastParam)!

  return fixer.removeRange([firstArg.range[0], tokenAfterLastParam.range[0]])
}

interface CalledKnownMemberExpression<Name extends string = string>
  extends KnownMemberExpression<Name> {
  parent: KnownCallExpression<Name>;
}

export interface KnownCallExpression<Name extends string = string>
  extends TSESTree.CallExpression {
  callee: CalledKnownMemberExpression<Name>;
}

export const isParsedInstanceOfMatcherCall = (
  expectFnCall: ParsedExpectVitestFnCall,
  classArg?: string
) => {
  return (
    getAccessorValue(expectFnCall.matcher) === 'toBeInstanceOf' &&
    expectFnCall.args.length === 1 &&
    isSupportedAccessor(expectFnCall.args[0], classArg)
  )
}
