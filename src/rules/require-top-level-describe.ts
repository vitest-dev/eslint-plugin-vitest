import { ESLintUtils } from "@typescript-eslint/experimental-utils";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/veritem/vitest-eslint-plugin/blob/docs/rules/${name}.md`
);

export default createRule({
  create(context) {
    return {
      FunctionDeclaration(node) {
        if (/^[a-z]/.test(node.id.name)) {
          context.report({
            messageId: "unexpectedTestCase",
            node: node.id,
          });
        }
      },
    };
  },
  meta: {
    docs: {
      description: `Disallow lowercase test case name`,
      recommended: false,
      //@ts-ignore
      url: "https://github.com/veritem/vitest-eslint-plugin/blob/docs/rules/no-lowercase-test-case-name.md",
      suggestion: false,
      requiresTypeChecking: false,
      extendsBaseRule: true,
    },
    type: "suggestion",
    messages: {
      unexpectedTestCase: "Test case should be wrapped in describe()",
    },
    schema: [],
  },
});
