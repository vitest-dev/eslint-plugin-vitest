import { RuleTester } from "@typescript-eslint/utils/dist/ts-eslint";
import { it } from "vitest";
import rule, { RULE_NAME } from "./no-focused-tests";

it(RULE_NAME, () => {
  const ruleTester: RuleTester = new RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
  });

  ruleTester.run(RULE_NAME, rule, {
    valid: [
      `it("test", () => {});`,
      `describe("test group", () => {});`
    ],

    invalid: [{
      code: `it.only("test", () => {});`,
      errors: [{
        column: 4,
        endColumn: 8,
        endLine: 1,
        line: 1,
        messageId: "noFocusedTests"
      }],
      output: `it.only("test", () => {});`,
    }, {
      code: `describe.only("test", () => {});`,
      errors: [{
        column: 10,
        endColumn: 14,
        endLine: 1,
        line: 1,
        messageId: "noFocusedTests"
      }],
      output: `describe.only("test", () => {});`,
    }]
  });
});
