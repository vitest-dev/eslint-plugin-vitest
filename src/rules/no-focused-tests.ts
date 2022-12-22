import { createEslintRule } from "../utils";

export type MessageIds = "noFocusedTests";
export const RULE_NAME = "no-focused-tests";
export type Options = [];

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description: "Disallow focused tests",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
        noFocusedTests: "Focused tests are not allowed.",
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      ExpressionStatement(node) {
        if (node.expression.type === "CallExpression") {
          const { callee } = node.expression;
          if (
            callee.type === "MemberExpression" &&
            callee.object.type === "Identifier" &&
            (callee.object.name === "it" || callee.object.name === "describe") &&
            callee.property.type === "Identifier" &&
            callee.property.name === "only"
          ) {
            context.report({
              node: callee.property,
              messageId: "noFocusedTests",
            });
          }
        }
      },
    };
  },
});
