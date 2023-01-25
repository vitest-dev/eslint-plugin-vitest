import { RuleTester } from '@typescript-eslint/utils/dist/ts-eslint'
import { it } from 'vitest'
import rule, { RULE_NAME } from './no-identical-title'

it('no identical title', () => {
	const ruleTester = new RuleTester({
		parser: require.resolve('@typescript-eslint/parser')
	})

	ruleTester.run(RULE_NAME, rule, {
		valid: [
			'it(); it();',
			'test("two", () => {});'
		],
		invalid: [
			{
				code: `describe('foo', () => {
					it('works', () => {});
					it('works', () => {});
				  });`,
				errors: [{ messageId: 'multipleTestTitle' }]
			}
		]
	})
})
