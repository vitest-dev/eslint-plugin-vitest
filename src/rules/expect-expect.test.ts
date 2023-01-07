import { RuleTester } from '@typescript-eslint/utils/dist/ts-eslint'
import { it } from 'vitest'
import rule, { RULE_NAME } from './expect-expect'

it(RULE_NAME, () => {
	const ruleTester = new RuleTester({
		parser: require.resolve('@typescript-eslint/parser')
	})

	ruleTester.run(RULE_NAME, rule, {
		valid: [
			`test("shows error", () => {
				expect(true).toBe(false);
			});`,
			`it("foo", function () {
				expect(true).toBe(false);
			})`,
			`it('foo', () => {
				expect(true).toBe(false);
			});
			function myTest() { if ('bar') {} }`
		],
		invalid: [
			{
				code: 'test("shows error", () => {});',
				output: 'test("shows error", () => {});',
				errors: [{ messageId: 'expected-expect' }]
			},
			{
				code: `it("foo", function () {
					if (1 === 2) {}
				})`,
				output: `it("foo", function () {
					if (1 === 2) {}
				})`,
				errors: [{ messageId: 'expected-expect' }]
			}
		]
	})
})
