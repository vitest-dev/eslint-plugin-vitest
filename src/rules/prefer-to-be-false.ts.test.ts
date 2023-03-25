import { RuleTester } from '@typescript-eslint/utils/dist/ts-eslint'
import { it, describe } from 'vitest'
import rule, { RULE_NAME } from './prefer-to-be-false'

const ruleTester: RuleTester = new RuleTester({
	parser: require.resolve('@typescript-eslint/parser')
})

describe(RULE_NAME, () => {
	it(RULE_NAME, () => {
		ruleTester.run(RULE_NAME, rule, {
			valid: [
				'[].push(false)',
				'expect("something");',
				'expect(true).toBeTruthy();',
				'expect(false).toBeTruthy();',
				'expect(false).toBeFalsy();',
				'expect(true).toBeFalsy();',
				'expect(value).toEqual();',
				'expect(value).not.toBeFalsy();',
				'expect(value).not.toEqual();'
			],
			invalid: [
				{
					code: 'expect(true).toBe(false);',
					output: 'expect(true).toBeFalsy();',
					errors: [{ messageId: 'preferToBeFalse', column: 14, line: 1 }]
				},
				{
					code: 'expect(wasSuccessful).toEqual(false);',
					output: 'expect(wasSuccessful).toBeFalsy();',
					errors: [{ messageId: 'preferToBeFalse', column: 23, line: 1 }]
				},
				{
					code: 'expect(fs.existsSync(\'/path/to/file\')).toStrictEqual(false);',
					output: 'expect(fs.existsSync(\'/path/to/file\')).toBeFalsy();',
					errors: [{ messageId: 'preferToBeFalse', column: 40, line: 1 }]
				},
				{
					code: 'expect("a string").not.toBe(false);',
					output: 'expect("a string").not.toBeFalsy();',
					errors: [{ messageId: 'preferToBeFalse', column: 24, line: 1 }]
				},
				{
					code: 'expect("a string").not.toEqual(false);',
					output: 'expect("a string").not.toBeFalsy();',
					errors: [{ messageId: 'preferToBeFalse', column: 24, line: 1 }]
				},
				{
					code: 'expect("a string").not.toStrictEqual(false);',
					output: 'expect("a string").not.toBeFalsy();',
					errors: [{ messageId: 'preferToBeFalse', column: 24, line: 1 }]
				}
			]
		})
	})
})
