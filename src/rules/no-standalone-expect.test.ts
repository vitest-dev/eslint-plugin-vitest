import { TSESLint } from '@typescript-eslint/utils'
import { describe, it } from 'vitest'
import rule, { RULE_NAME } from './no-standalone-expect'

const ruleTester = new TSESLint.RuleTester({
	parser: require('@typescript-eslint/parser')
})

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
			invalid: []
		})
	})
})
