import { RuleTester } from '@typescript-eslint/utils/dist/ts-eslint'
import { describe, it } from 'vitest'
import { TestCaseName } from '../utils/types'
import rule, { RULE_NAME } from './prefer-lowercase-title'

describe(RULE_NAME, () => {
	it(RULE_NAME, () => {
		const ruleTester: RuleTester = new RuleTester({
			parser: require.resolve('@typescript-eslint/parser')
		})
		ruleTester.run(RULE_NAME, rule, {
			valid: [
				'it.each()',
				'it.each()(1)',
				'describe("oo", function () {})',
				'test("foo", function () {})',
				'test(`123`, function () {})'
			],
			invalid: [
				{
					code: 'it("Foo MM mm", function () {})',
					output: 'it("foo MM mm", function () {})',
					errors: [
						{
							messageId: 'lowerCaseTitle',
							data: {
								method: TestCaseName.it
							}
						}
					]
				},
				{
					code: 'test(`Foo MM mm`, function () {})',
					output: 'test(`foo MM mm`, function () {})',
					errors: [
						{
							messageId: 'lowerCaseTitle',
							data: {
								method: TestCaseName.test
							}
						}
					]
				}
			]
		})
	})
})
