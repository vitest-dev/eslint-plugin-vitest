import { describe, it } from 'vitest'
import rule, { RULE_NAME } from '../src/rules/no-standalone-expect'
import { ruleTester } from './ruleTester'

describe(RULE_NAME, () => {
	it(RULE_NAME, () => {
		ruleTester.run(RULE_NAME, rule, {
			valid: [
				'expect.any(String)',
				'expect.extend({})',
				'describe("a test", () => { it("an it", () => {expect(1).toBe(1); }); });',
				'describe("a test", () => { it("an it", () => { const func = () => { expect(1).toBe(1); }; }); });',
				'describe("a test", () => { const func = () => { expect(1).toBe(1); }; });',
				'describe("a test", () => { function func() { expect(1).toBe(1); }; });',
				'describe("a test", () => { const func = function(){ expect(1).toBe(1); }; });',
				'it("an it", () => expect(1).toBe(1))',
				'const func = function(){ expect(1).toBe(1); };',
				'const func = () => expect(1).toBe(1);',
				'{}',
				'it.each([1, true])("trues", value => { expect(value).toBe(true); });',
				'it.each([1, true])("trues", value => { expect(value).toBe(true); }); it("an it", () => { expect(1).toBe(1) });'
			],
			invalid: [
				{
					code: '(() => {})(\'testing\', () => expect(true).toBe(false))',
					errors: [{ endColumn: 53, column: 29, messageId: 'noStandaloneExpect' }]
				},
				{
					code: 'expect.hasAssertions()',
					errors: [{ endColumn: 23, column: 1, messageId: 'noStandaloneExpect' }]
				},
				{
					code: `
					  describe('scenario', () => {
						const t = Math.random() ? it.only : it;
						t('testing', () => expect(true).toBe(false));
					  });
					`,
					errors: [{ endColumn: 50, column: 26, messageId: 'noStandaloneExpect' }]
				},
				{
					code: `describe('scenario', () => {
						const t = Math.random() ? it.only : it;
						t('testing', () => expect(true).toBe(false));
					  });`,
					errors: [{ endColumn: 50, column: 26, messageId: 'noStandaloneExpect' }]
				},
				{
					code: 'describe("a test", () => { expect(1).toBe(1); });',
					errors: [{ endColumn: 45, column: 28, messageId: 'noStandaloneExpect' }]
				},
				{
					code: 'describe("a test", () => expect(1).toBe(1));',
					errors: [{ endColumn: 43, column: 26, messageId: 'noStandaloneExpect' }]
				},
				{
					code: 'describe("a test", () => { const func = () => { expect(1).toBe(1); }; expect(1).toBe(1); });',
					errors: [{ endColumn: 88, column: 71, messageId: 'noStandaloneExpect' }]
				},
				{
					code: 'describe("a test", () => {  it(() => { expect(1).toBe(1); }); expect(1).toBe(1); });',
					errors: [{ endColumn: 80, column: 63, messageId: 'noStandaloneExpect' }]
				},
				{
					code: 'expect(1).toBe(1);',
					errors: [{ endColumn: 18, column: 1, messageId: 'noStandaloneExpect' }]
				},
				{
					code: '{expect(1).toBe(1)}',
					errors: [{ endColumn: 19, column: 2, messageId: 'noStandaloneExpect' }]
				},
				{
					code: `
					each([
					  [1, 1, 2],
					  [1, 2, 3],
					  [2, 1, 3],
					]).test('returns the result of adding %d to %d', (a, b, expected) => {
					  expect(a + b).toBe(expected);
					});`,
					options: [{ additionalTestBlockFunctions: ['test'] }],
					errors: [{ endColumn: 36, column: 8, messageId: 'noStandaloneExpect' }]
				}
			]
		})
	})
})
