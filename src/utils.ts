import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESTree,
} from "@typescript-eslint/experimental-utils";
import { parse } from "path";
import PackageJSON from "../package.json";

const REPO_URL = "https://github.com/veritem/eslint-plugin-vitest";

export const createRule = ESLintUtils.RuleCreator((name) => {
  const ruleName = parse(name).name;
  return `${REPO_URL}/blob/v${PackageJSON.version}/docs/rules/${ruleName}.md`;
});

export enum TestCaseName {
  "test" = "test",
}

export enum DescribeAlias {
  "describe" = "describe",
}

interface StringLiteral<Value extends string = string>
  extends TSESTree.StringLiteral {
  value: Value;
}

export const isStringLiteral = <V extends string>(
  node: TSESTree.Node,
  value?: V
): node is StringLiteral<V> =>
  node.type === AST_NODE_TYPES.Literal &&
  typeof node.value === "string" &&
  (value === undefined || node.value === value);

export type FunctionExpression =
  | TSESTree.ArrowFunctionExpression
  | TSESTree.FunctionExpression;

export const isFunction = (node: TSESTree.Node): node is FunctionExpression =>
  node.type === AST_NODE_TYPES.FunctionExpression ||
  node.type === AST_NODE_TYPES.ArrowFunctionExpression;

export const isTestCaseName = (node: TSESTree.LeftHandSideExpression) =>
  node.type === AST_NODE_TYPES.Identifier &&
  TestCaseName.hasOwnProperty(node.name);

// TODO: Add more describe alias
const isDescribeAlias = (node: TSESTree.LeftHandSideExpression) =>
  node.type === AST_NODE_TYPES.Identifier && node.name === "describe";

const isDescribeProperty = (
  node: TSESTree.Expression | TSESTree.PrivateIdentifier
) =>
  node.type === AST_NODE_TYPES.Identifier &&
  DescribeAlias.hasOwnProperty(node.name);

// export const isDescribeCall = (
//     node: TSESTree.CallExpression,
// ): node is DescribeAlias => {
//     if (isDescribeAlias(node.callee)) {
//         return true
//     }

//     const callee =
//         node.callee.type === AST_NODE_TYPES.TaggedTemplateExpression
//             ? node.callee.tag
//             : node.callee.type === AST_NODE_TYPES.CallExpression
//                 ? node.callee.callee
//                 : node.callee

//     if (
//         callee.type === AST_NODE_TYPES.MemberExpression &&
//         isDescribeProperty(callee.property)
//     ) {
//         // if we're an `each()`, ensure we're the outer CallExpression (i.e `.each()()`)
//         if (
//             getAccessorValue(callee.property) === 'each' &&
//             node.callee.type !== AST_NODE_TYPES.TaggedTemplateExpression &&
//             node.callee.type !== AST_NODE_TYPES.CallExpression
//         ) {
//             return false
//         }

//         return callee.object.type === AST_NODE_TYPES.MemberExpression
//             ? isDescribeAlias(callee.object.object)
//             : isDescribeAlias(callee.object)
//     }

//     return false
// }

function getAccessorValue(
  property: TSESTree.Expression | TSESTree.PrivateIdentifier
) {
  throw new Error("Function not implemented.");
}
