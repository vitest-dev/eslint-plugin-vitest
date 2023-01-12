import { RuleTester } from '@typescript-eslint/utils/dist/ts-eslint'
import { it } from 'vitest'
import rule, { RULE_NAME } from './lower-case-title'

const valids = [
	'it.each()',
	'it.each()(1)',
	'test("foo", function () {})',
	'test(`foo`, function () {})',
	'describe(\'foo\', function () {})',
	'describe("foo", function () {})'
]

it(RULE_NAME, () => {
	const ruleTester: RuleTester = new RuleTester({
		parser: require.resolve('@typescript-eslint/parser')
	})
	ruleTester.run(RULE_NAME, rule, {
		valid: valids,
		invalid: [
			{
				code: 'it(\'Foo MM mm\', function () {})',
				output: 'it(\'foo MM mm\', function () {})',
				errors: [
					{
						messageId: 'lowerCaseTitle',
						column: 1,
						line: 1
					}
				]
			},
			{
				code: 'describe(\'Foo mmm mm\', function () {})',
				output: 'describe(\'foo mmm mm\', function () {})',
				errors: [
					{
						messageId: 'lowerCaseTitle'
					}
				]
			},
			{
				code: 'describe(`Some longer description`, function () {})',
				output: 'describe(`some longer description`, function () {})',
				errors: [
					{
						messageId: 'lowerCaseTitle'
					}
				]
			},
			{
				code: 'it(`userAuth`, function () {})',
				output: 'it(`user auth`, function () {})',
				errors: [
					{
						messageId: 'lowerCaseTitle'
					}
				]
			}
		]
	})
})
