import { RuleTester } from "@typescript-eslint/utils/dist/ts-eslint";
import rule, { RULE_NAME } from "./expect-expect";
import { it } from "vitest"

it(RULE_NAME, () => {

	const ruleTester = new RuleTester({
		parser: require.resolve("@typescript-eslint/parser"),
	});

	ruleTester.run(RULE_NAME, rule, {
		valid: [
			`test("shows error", () => {});`,
			`it("foo", function () {})`,
			`it('foo', () => {}); function myTest() { if ('bar') {} }`,
		],
		invalid: [
			{
				code: `test("shows error", () => {
					if (1 === 2) {
					  expect(true).toBe(false);
					}
				  });`,
				output: `test("shows error", () => {
					if (1 === 2) {
					  expect(true).toBe(false);
					}
				  });`,
				errors: [{ messageId: "expected-expect" }],
			},
			{
				code: `it("foo", function () {
					if (1 === 2) {
						expect(true).toBe(false);
					}
				})`,
				output: `it("foo", function () {
					if (1 === 2) {
						expect(true).toBe(false);
					}
				})`,
				errors: [{ messageId: "expected-expect" }],
			}
		]
	});

})