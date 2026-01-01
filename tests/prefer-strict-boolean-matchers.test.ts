import rule from '../src/rules/prefer-strict-boolean-matchers'
import { ruleTester } from './ruleTester'

const messageIdTrue = 'preferToBeTrue'
const messageIdFalse = 'preferToBeFalse'

ruleTester.run(rule.name, rule, {
  valid: [
    '[].push(true)',
    '[].push(false)',
    'expect("something");',
    'expect(true).toBe(true);',
    'expect(true).toBe(false);',
    'expect(false).toBe(true);',
    'expect(false).toBe(false);',
    'expect(fal,se).toBe(true);',
    'expect(fal,se).toBe(false);',
    'expect(value).toEqual();',
    'expect(value).not.toBe(true);',
    'expect(value).not.toBe(false);',
    'expect(value).not.toEqual();',
    'expect(value).toBe(undefined);',
    'expect(value).not.toBe(undefined);',
    'expect(value).toBe();',
    'expect(true).toMatchSnapshot();',
    'expect("a string").toMatchSnapshot(true);',
    'expect("a string").toMatchSnapshot(false);',
    'expect("a string").not.toMatchSnapshot();',
    "expect(something).toEqual('a string');",
    'expect(true).toBe',
    'expectTypeOf(true).toBe()',
  ],
  invalid: [
    {
      code: 'expect(false).toBeTruthy();',
      output: 'expect(false).toBe(true);',
      errors: [{ messageId: messageIdTrue, column: 15, line: 1 }],
    },
    {
      code: 'expect(false).toBeFalsy();',
      output: 'expect(false).toBe(false);',
      errors: [{ messageId: messageIdFalse, column: 15, line: 1 }],
    },
    {
      code: 'expectTypeOf(false).toBeTruthy();',
      output: 'expectTypeOf(false).toBe(true);',
      errors: [{ messageId: messageIdTrue, column: 21, line: 1 }],
    },
    {
      code: 'expectTypeOf(false).toBeFalsy();',
      output: 'expectTypeOf(false).toBe(false);',
      errors: [{ messageId: messageIdFalse, column: 21, line: 1 }],
    },
    {
      code: 'expect(wasSuccessful).toBeTruthy();',
      output: 'expect(wasSuccessful).toBe(true);',
      errors: [{ messageId: messageIdTrue, column: 23, line: 1 }],
    },
    {
      code: 'expect(wasSuccessful).toBeFalsy();',
      output: 'expect(wasSuccessful).toBe(false);',
      errors: [{ messageId: messageIdFalse, column: 23, line: 1 }],
    },
    {
      code: 'expect("a string").not.toBeTruthy();',
      output: 'expect("a string").not.toBe(true);',
      errors: [{ messageId: messageIdTrue, column: 24, line: 1 }],
    },
    {
      code: 'expect("a string").not.toBeFalsy();',
      output: 'expect("a string").not.toBe(false);',
      errors: [{ messageId: messageIdFalse, column: 24, line: 1 }],
    },
  ],
})
