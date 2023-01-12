import { RuleTester } from '@typescript-eslint/utils/dist/ts-eslint'
import { it } from 'vitest'
import rule, { RULE_NAME } from './no-skipped-tests'

const valids = ['it("test", () => {});']

const invalids = [
	'it.skip("test", () => {});',
	`describe.skip("math", () => {
		it("works", () => {
		  expect(1+1).toBe(2);
		})
	  })`
]

it(RULE_NAME, () => {
	const ruleTester: RuleTester = new RuleTester({
		parser: require.resolve('@typescript-eslint/parser')
	})
	ruleTester.run(RULE_NAME, rule, {
		valid: valids,
		invalid: invalids.map((i) => ({
			code: i,
			output: i.trim(),
			errors: [{ messageId: 'noSkippedTests' }]
		}))
	})
})
