import { describe, test } from 'vitest'
import rule, { RULE_NAME } from '../src/rules/prefer-mock-promise-shorthand'
import { ruleTester } from './ruleTester'

describe(RULE_NAME, () => {
	test(RULE_NAME, () => {
		ruleTester.run(RULE_NAME, rule, {
			valid: [
				'describe()',
				'it()',
				'describe.skip()',
				'it.skip()',
				'test()',
				'test.skip()',
				'var appliedOnly = describe.only; appliedOnly.apply(describe)',
				'var calledOnly = it.only; calledOnly.call(it)',
				'it.each()()',
				'it.each`table`()',
				'test.each()()',
				'test.each`table`()',
				'test.concurrent()',
				'vi.fn().mockResolvedValue(42)',
				'vi.fn(() => Promise.resolve(42))',
				'vi.fn(() => Promise.reject(42))',
				'aVariable.mockImplementation',
				'aVariable.mockImplementation()',
				'aVariable.mockImplementation([])',
				'aVariable.mockImplementation(() => {})',
				'aVariable.mockImplementation(() => [])',
				'aVariable.mockReturnValue(() => Promise.resolve(1))',
				'aVariable.mockReturnValue(Promise.resolve(1).then(() => 1))',
				'aVariable.mockReturnValue(Promise.reject(1).then(() => 1))',
				'aVariable.mockReturnValue(Promise.reject().then(() => 1))',
				'aVariable.mockReturnValue(new Promise(resolve => resolve(1)))',
				'aVariable.mockReturnValue(new Promise((_, reject) => reject(1)))',
				'vi.spyOn(Thingy, \'method\').mockImplementation(param => Promise.resolve(param));'
			],
			invalid: [
				{
					code: 'vi.fn().mockImplementation(() => Promise.resolve(42))',
					output: 'vi.fn().mockResolvedValue(42)',
					errors: [
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockResolvedValue' },
							column: 9,
							line: 1
						}
					]
				},
				{
					code: 'vi.fn().mockImplementation(() => Promise.reject(42))',
					output: 'vi.fn().mockRejectedValue(42)',
					errors: [
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockRejectedValue' },
							column: 9,
							line: 1
						}
					]
				},
				{
					code: 'aVariable.mockImplementation(() => Promise.resolve(42))',
					output: 'aVariable.mockResolvedValue(42)',
					errors: [
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockResolvedValue' },
							column: 11,
							line: 1
						}
					]
				},
				{
					code: 'aVariable.mockImplementation(() => { return Promise.resolve(42) })',
					output: 'aVariable.mockResolvedValue(42)',
					errors: [
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockResolvedValue' },
							column: 11,
							line: 1
						}
					]
				},
				{
					code: 'aVariable.mockImplementation(() => Promise.reject(42))',
					output: 'aVariable.mockRejectedValue(42)',
					errors: [
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockRejectedValue' },
							column: 11,
							line: 1
						}
					]
				},
				{
					code: 'aVariable.mockImplementation(() => Promise.reject(42),)',
					output: 'aVariable.mockRejectedValue(42,)',
					parserOptions: { ecmaVersion: 2017 },
					errors: [
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockRejectedValue' },
							column: 11,
							line: 1
						}
					]
				},
				{
					code: 'aVariable.mockImplementationOnce(() => Promise.resolve(42))',
					output: 'aVariable.mockResolvedValueOnce(42)',
					errors: [
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockResolvedValueOnce' },
							column: 11,
							line: 1
						}
					]
				},
				{
					code: 'aVariable.mockImplementationOnce(() => Promise.reject(42))',
					output: 'aVariable.mockRejectedValueOnce(42)',
					errors: [
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockRejectedValueOnce' },
							column: 11,
							line: 1
						}
					]
				},
				{
					code: 'vi.fn().mockReturnValue(Promise.resolve(42))',
					output: 'vi.fn().mockResolvedValue(42)',
					errors: [
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockResolvedValue' },
							column: 9,
							line: 1
						}
					]
				},
				{
					code: 'vi.fn().mockReturnValue(Promise.reject(42))',
					output: 'vi.fn().mockRejectedValue(42)',
					errors: [
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockRejectedValue' },
							column: 9,
							line: 1
						}
					]
				},
				{
					code: 'aVariable.mockReturnValue(Promise.resolve(42))',
					output: 'aVariable.mockResolvedValue(42)',
					errors: [
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockResolvedValue' },
							column: 11,
							line: 1
						}
					]
				},
				{
					code: 'aVariable.mockReturnValue(Promise.reject(42))',
					output: 'aVariable.mockRejectedValue(42)',
					errors: [
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockRejectedValue' },
							column: 11,
							line: 1
						}
					]
				},
				{
					code: 'aVariable.mockReturnValueOnce(Promise.resolve(42))',
					output: 'aVariable.mockResolvedValueOnce(42)',
					errors: [
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockResolvedValueOnce' },
							column: 11,
							line: 1
						}
					]
				},
				{
					code: 'aVariable.mockReturnValueOnce(Promise.reject(42))',
					output: 'aVariable.mockRejectedValueOnce(42)',
					errors: [
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockRejectedValueOnce' },
							column: 11,
							line: 1
						}
					]
				},
				{
					code: 'aVariable.mockReturnValue(Promise.resolve({ target: \'world\', message: \'hello\' }))',
					output: 'aVariable.mockResolvedValue({ target: \'world\', message: \'hello\' })',
					errors: [
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockResolvedValue' },
							column: 11,
							line: 1
						}
					]
				},
				{
					code: 'aVariable.mockImplementation(() => Promise.reject(42)).mockImplementation(() => Promise.resolve(42)).mockReturnValue(Promise.reject(42))',
					output: 'aVariable.mockRejectedValue(42).mockResolvedValue(42).mockRejectedValue(42)',
					errors: [
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockRejectedValue' },
							column: 11,
							line: 1
						},
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockResolvedValue' },
							column: 56,
							line: 1
						},
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockRejectedValue' },
							column: 102,
							line: 1
						}
					]
				},
				{
					code: 'aVariable.mockReturnValueOnce(Promise.reject(42)).mockImplementation(() => Promise.resolve(42)).mockReturnValueOnce(Promise.reject(42))',
					output: 'aVariable.mockRejectedValueOnce(42).mockResolvedValue(42).mockRejectedValueOnce(42)',
					errors: [
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockRejectedValueOnce' },
							column: 11,
							line: 1
						},
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockResolvedValue' },
							column: 51,
							line: 1
						},
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockRejectedValueOnce' },
							column: 97,
							line: 1
						}
					]
				},
				{
					code: 'aVariable.mockReturnValueOnce(Promise.reject(new Error(\'oh noes!\')))',
					output: 'aVariable.mockRejectedValueOnce(new Error(\'oh noes!\'))',
					errors: [
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockRejectedValueOnce' },
							column: 11,
							line: 1
						}
					]
				},
				{
					code: 'vi.fn().mockReturnValue(Promise.resolve(42), xyz)',
					output: 'vi.fn().mockResolvedValue(42, xyz)',
					errors: [
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockResolvedValue' },
							column: 9,
							line: 1
						}
					]
				},
				{
					code: 'vi.fn().mockImplementation(() => Promise.reject(42), xyz)',
					output: 'vi.fn().mockRejectedValue(42, xyz)',
					errors: [
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockRejectedValue' },
							column: 9,
							line: 1
						}
					]
				},
				{
					code: 'aVariable.mockReturnValueOnce(Promise.resolve(42, xyz))',
					output: null,
					errors: [
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockResolvedValueOnce' },
							column: 11,
							line: 1
						}
					]
				},
				{
					code: 'aVariable.mockReturnValueOnce(Promise.resolve())',
					output: 'aVariable.mockResolvedValueOnce(undefined)',
					errors: [
						{
							messageId: 'useMockShorthand',
							data: { replacement: 'mockResolvedValueOnce' },
							column: 11,
							line: 1
						}
					]
				}
			]
		})
	})
})
