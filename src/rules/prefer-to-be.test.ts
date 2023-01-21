import { RuleTester } from '@typescript-eslint/utils/dist/ts-eslint'
import { it } from 'vitest'
import rule, { RULE_NAME } from './prefer-to-be'

it(RULE_NAME, () => {
	const ruleTester: RuleTester = new RuleTester({
		parser: require.resolve('@typescript-eslint/parser')
	})

	ruleTester.run(RULE_NAME, rule, {
		valid: [
			'expect(null).toBeNull();',
			'expect(null).not.toBeNull();',
			'expect(null).toBe(1);',
			'expect(null).toBe(-1);',
			'expect(null).toBe(...1);',
			'expect(obj).toStrictEqual([ x, 1 ]);',
			'expect(obj).toStrictEqual({ x: 1 });',
			'expect(obj).not.toStrictEqual({ x: 1 });',
			'expect(value).toMatchSnapshot();',
			'expect(catchError()).toStrictEqual({ message: \'oh noes!\' })',
			'expect("something");',
			'expect(token).toStrictEqual(/[abc]+/g);',
			'expect(token).toStrictEqual(new RegExp(\'[abc]+\', \'g\'));',
			'expect(value).toEqual(`my string`);'
		],
		invalid: [
			// {
			//	code: 'expect(value).toEqual("my string");',
			//	output: 'expect(value).toBe("my string");',
			//	errors: [{ messageId: 'useToBe' }]
			// }
		]
	})
})
