import { RuleTester } from "@typescript-eslint/utils/dist/ts-eslint";
import { it } from "vitest";
import rule, { RULE_NAME } from "./no-identical-title";

const valids = [
  `describe('foo', function () {
    it('should do foo', function() {});
    it('should do bar', function() {});
});
`,
  `
describe('test', function () {
    describe('foo', function () {
    it('should do bar', function() {});
    });
    describe('foo 1', function () {
    it('should do mm', function() {});
    });
  });
`,
];

const invalids = [
  `describe('foo', function () {
    it('should do bar', function() {});
    it('should do bar', function() {}); 
});`,
  `
  describe('test', function () {
    describe('foo', function () {
    it('should do bar', function() {});
    });
    describe('foo', function () {
    it('should do mm', function() {});
    });
  });
`,
];

it("no identical title", () => {
  const ruleTester = new RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
  });

  ruleTester.run(RULE_NAME, rule, {
    valid: valids,
    invalid: invalids.map((i) => ({
      code: i,
      output: i,
      errors: [{ messageId: "noIdenticalTitle" }],
    })),
  });
});
