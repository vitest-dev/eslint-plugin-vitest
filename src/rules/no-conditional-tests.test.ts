import { RuleTester } from '@typescript-eslint/utils/dist/ts-eslint'
import { it, describe } from 'vitest'
import rule, { RULE_NAME } from './no-conditional-tests'

describe(RULE_NAME, () => {
	const ruleTester = new RuleTester({
		parser: require.resolve('@typescript-eslint/parser')
	})

	it('if statements', () => {
		ruleTester.run(RULE_NAME, rule, {
			valid: [
				'test("shows error", () => {});',
				'it("foo", function () {})',
				'it(\'foo\', () => {}); function myTest() { if (\'bar\') {} }'
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
					errors: [{ messageId: 'noConditionalTests' }]
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
					errors: [{ messageId: 'noConditionalTests' }]
				}
			]
		})
	})

	it.skip('ternary statements', () => {
		ruleTester.run(RULE_NAME, rule, {
			valid: [
				'test("shows error", () => {});',
				'it("foo", function () {})',
				'it(\'foo\', () => {}); function myTest() { if (\'bar\') {} }'
			],
			invalid: [
				{
					code: `test("shows error", () => {
						const foo = true ? 'foo' : 'bar';
						expect(foo).toBe('foo');
					  });`,
					output: `test("shows error", () => {
						const foo = true ? 'foo' : 'bar';
						expect(foo).toBe('foo');
					  });`,
					errors: [{ messageId: 'noConditionalTests' }]
				},
				{
					code: `it("foo", function () {
						const foo = true ? 'foo' : 'bar';
						expect(foo).toBe('foo');
					})`,
					output: `it("foo", function () {
						const foo = true ? 'foo' : 'bar';
						expect(foo).toBe('foo');
					})`,
					errors: [{ messageId: 'noConditionalTests' }]
				}
			]
		})

		it.skip('switch statements', () => {
			ruleTester.run(RULE_NAME, rule, {
				valid: [
					'test("shows error", () => {});',
					'it("foo", function () {})',
					'it(\'foo\', () => {}); function myTest() { if (\'bar\') {} }'
				],
				invalid: [
					{
						code: `test("shows error", () => {
							switch (1) {
								case 1:
									expect(true).toBe(false);
									break;
								default:
									expect(true).toBe(false);
							}
						  });`,
						output: `test("shows error", () => {
							switch (1) {
								case 1:
									expect(true).toBe(false);
									break;
								default:
									expect(true).toBe(false);
							}
						  });`,
						errors: [{ messageId: 'noConditionalTests' }]
					},
					{
						code: `it("foo", function () {
							switch (1) {
								case 1:
									expect(true).toBe(false);
									break;
								default:
									expect(true).toBe(false);
							}
						})`,
						output: `it("foo", function () {
							switch (1) {
								case 1:
									expect(true).toBe(false);
									break;
								default:
									expect(true).toBe(false);
							}
						})`,
						errors: [{ messageId: 'noConditionalTests' }]
					}
				]
			})
		})
	})
})
