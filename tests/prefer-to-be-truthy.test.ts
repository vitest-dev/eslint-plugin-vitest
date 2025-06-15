import rule, { RULE_NAME } from '../src/rules/prefer-to-be-truthy'
import { ruleTester } from './ruleTester'

const messageId = 'preferToBeTruthy'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    '[].push(true)',
    'expect("something");',
    'expect(true).toBeTrue();',
    'expect(false).toBeTrue();',
    'expect(fal,se).toBeFalse();',
    'expect(true).toBeFalse();',
    'expect(value).toEqual();',
    'expect(value).not.toBeTrue();',
    'expect(value).not.toEqual();',
    'expect(value).toBe(undefined);',
    'expect(value).not.toBe(undefined);',
    'expect(true).toBe(false)',
    'expect(value).toBe();',
    'expect(true).toMatchSnapshot();',
    'expect("a string").toMatchSnapshot(true);',
    'expect("a string").not.toMatchSnapshot();',
    "expect(something).toEqual('a string');",
    'expect(true).toBe',
    'expectTypeOf(true).toBe()',
  ],
  invalid: [
    {
      code: 'expect(false).toBe(true);',
      output: 'expect(false).toBeTruthy();',
      errors: [{ messageId, column: 15, line: 1 }],
    },
    {
      code: 'expectTypeOf(false).toBe(true);',
      output: 'expectTypeOf(false).toBeTruthy();',
      errors: [{ messageId, column: 21, line: 1 }],
    },
    {
      code: 'expect(wasSuccessful).toEqual(true);',
      output: 'expect(wasSuccessful).toBeTruthy();',
      errors: [{ messageId, column: 23, line: 1 }],
    },
    {
      code: "expect(fs.existsSync('/path/to/file')).toStrictEqual(true);",
      output: "expect(fs.existsSync('/path/to/file')).toBeTruthy();",
      errors: [{ messageId, column: 40, line: 1 }],
    },
    {
      code: 'expect("a string").not.toBe(true);',
      output: 'expect("a string").not.toBeTruthy();',
      errors: [{ messageId, column: 24, line: 1 }],
    },
    {
      code: 'expect("a string").not.toEqual(true);',
      output: 'expect("a string").not.toBeTruthy();',
      errors: [{ messageId, column: 24, line: 1 }],
    },
    {
      code: 'expectTypeOf("a string").not.toStrictEqual(true);',
      output: 'expectTypeOf("a string").not.toBeTruthy();',
      errors: [{ messageId, column: 30, line: 1 }],
    },
  ],
})
