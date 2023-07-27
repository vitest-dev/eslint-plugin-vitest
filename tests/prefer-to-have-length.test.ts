import { test, describe } from 'vitest'
import rule, { RULE_NAME } from '../src/rules/prefer-to-have-length'
import { ruleTester } from './ruleTester'

const messageId = 'preferToHaveLength'

describe(RULE_NAME, () => {
	test(RULE_NAME, () => {
		ruleTester.run(RULE_NAME, rule, {
			valid: [
				'expect.hasAssertions',
				'expect.hasAssertions()',
				'expect(files).toHaveLength(1);',
				'expect(files.name).toBe(\'file\');',
				'expect(files[`name`]).toBe(\'file\');',
				'expect(users[0]?.permissions?.length).toBe(1);',
				'expect(result).toBe(true);',
				'expect(user.getUserName(5)).resolves.toEqual(\'Paul\')',
				'expect(user.getUserName(5)).rejects.toEqual(\'Paul\')',
				'expect(a);',
				'expect().toBe();'
			],
			invalid: [
				{
					code: 'expect(files["length"]).toBe(1);',
					output: 'expect(files).toHaveLength(1);',
					errors: [{ messageId, column: 25, line: 1 }]
				},
				{
					code: 'expect(files["length"]).toBe(1,);',
					output: 'expect(files).toHaveLength(1,);',
					parserOptions: { ecmaVersion: 2017 },
					errors: [{ messageId, column: 25, line: 1 }]
				},
				{
					code: 'expect(files["length"])["not"].toBe(1);',
					output: 'expect(files)["not"].toHaveLength(1);',
					errors: [{ messageId, column: 32, line: 1 }]
				},
				{
					code: 'expect(files["length"])["toBe"](1);',
					output: 'expect(files).toHaveLength(1);',
					errors: [{ messageId, column: 25, line: 1 }]
				},
				{
					code: 'expect(files["length"]).not["toBe"](1);',
					output: 'expect(files).not.toHaveLength(1);',
					errors: [{ messageId, column: 29, line: 1 }]
				},
				{
					code: 'expect(files["length"])["not"]["toBe"](1);',
					output: 'expect(files)["not"].toHaveLength(1);',
					errors: [{ messageId, column: 32, line: 1 }]
				},
				{
					code: 'expect(files.length).toBe(1);',
					output: 'expect(files).toHaveLength(1);',
					errors: [{ messageId, column: 22, line: 1 }]
				},
				{
					code: 'expect(files.length).toEqual(1);',
					output: 'expect(files).toHaveLength(1);',
					errors: [{ messageId, column: 22, line: 1 }]
				},
				{
					code: 'expect(files.length).toStrictEqual(1);',
					output: 'expect(files).toHaveLength(1);',
					errors: [{ messageId, column: 22, line: 1 }]
				},
				{
					code: 'expect(files.length).not.toStrictEqual(1);',
					output: 'expect(files).not.toHaveLength(1);',
					errors: [{ messageId, column: 26, line: 1 }]
				}
			]
		})
	})
})
