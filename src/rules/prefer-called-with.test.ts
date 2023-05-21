import { TSESLint } from '@typescript-eslint/utils'
import { describe, test } from 'vitest'
import rule, { RULE_NAME } from './prefer-called-with'

const ruleTester = new TSESLint.RuleTester({
	parser: require.resolve('@typescript-eslint/parser')
})

describe(RULE_NAME, () => {
	test(RULE_NAME, () => {
		ruleTester.run(RULE_NAME, rule, {
			valid: [
				'expect(fn).toBeCalledWith();',
				'expect(fn).toHaveBeenCalledWith();',
				'expect(fn).toBeCalledWith(expect.anything());',
				'expect(fn).toHaveBeenCalledWith(expect.anything());',
				'expect(fn).not.toBeCalled();',
				'expect(fn).rejects.not.toBeCalled();',
				'expect(fn).not.toHaveBeenCalled();',
				'expect(fn).not.toBeCalledWith();',
				'expect(fn).not.toHaveBeenCalledWith();',
				'expect(fn).resolves.not.toHaveBeenCalledWith();',
				'expect(fn).toBeCalledTimes(0);',
				'expect(fn).toHaveBeenCalledTimes(0);',
				'expect(fn);',
			],
			invalid: [
				{
					code: 'expect(fn).toBeCalled();',
					errors: [
						{
							messageId: 'preferCalledWith',
							data: { matcherName: 'toBeCalled' },
							column: 12,
							line: 1
						}
					]
				},
				{
					code: 'expect(fn).resolves.toBeCalled();',
					errors: [
						{
							messageId: 'preferCalledWith',
							data: { matcherName: 'toBeCalled' },
							column: 21,
							line: 1
						}
					]
				},
				{
					code: 'expect(fn).toHaveBeenCalled();',
					errors: [
						{
							messageId: 'preferCalledWith',
							data: { matcherName: 'toHaveBeenCalled' },
							column: 12,
							line: 1
						}
					]
				},
				{
					code: `it("some test", () => {
						// I expect the suggestion (prefer toHaveBeenCalledOnceWith)
						expect(mockApi).toHaveBeenCalledOnce(); 
					  });`,
					errors: [
						{
							messageId: 'preferCalledWith',
							data: { matcherName: 'toHaveBeenCalledOnce' },
							column: 23,
							line: 3
						}
					]
				}
			]
		})
	})
})
