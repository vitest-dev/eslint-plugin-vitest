import { createEslintRule } from "../utils";

export type MessageIds = 'noSkippedTests';
export const RULE_NAME = 'no-skipped-tests';
export type Options = []

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description: "Disallow skipped tests",
      recommended: "error",
    },
    fixable: 'code',
    schema: [],
    messages: {
      noSkippedTests: "Skipped tests are not allowed.",
    }
  },
  defaultOptions: [],
  create: (context) => {
    return {
      CallExpression(node) {
        if (node.callee.type === "MemberExpression" && node.callee.object.loc.end.line === node.callee.property.loc.start.line) {
          context.report({
            node: node.arguments[0],
            messageId: 'noSkippedTests',
            fix: (fixer) => {
              return fixer.replaceText(node.arguments[0], 'test');
            }
          })
        }
      }
    }
  }
})
