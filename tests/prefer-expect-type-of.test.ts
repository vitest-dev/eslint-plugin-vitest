import { RuleTester } from '@typescript-eslint/rule-tester'
import rule, { RULE_NAME } from '../src/rules/prefer-expect-type-of'

const ruleTester = new RuleTester()

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'expectTypeOf("name").toBeString()',
    'expectTypeOf("name").not.toBeString()',
    'expectTypeOf(12).toBeNumber()',
    'expectTypeOf(12).not.toBeNumber()',
    'expectTypeOf(true).toBeBoolean()',
    'expectTypeOf({a: 1}).toBeObject()',
    'expectTypeOf(() => {}).toBeFunction()',
    'expectTypeOf(sym).toBeSymbol()',
    'expectTypeOf(BigInt(123)).toBeBigInt()',
    'expectTypeOf(undefined).toBeUndefined()',
    'expect(value).not.toBe(42)',
    'expect(value).not.toEqual(42)',
  ],
  invalid: [
    {
      code: 'expect(typeof 12).toBe("number")',
      output: 'expectTypeOf(12).toBeNumber()',
      errors: [
        {
          messageId: 'preferExpectTypeOf',
          data: {
            value: '12',
            matcher: 'toBeNumber',
            type: 'number',
          },
        },
      ],
    },
    {
      code: 'expect(typeof "name").toBe("string")',
      output: 'expectTypeOf("name").toBeString()',
      errors: [
        {
          messageId: 'preferExpectTypeOf',
          data: {
            value: '"name"',
            matcher: 'toBeString',
            type: 'string',
          },
        },
      ],
    },
    {
      code: 'expect(typeof true).toBe("boolean")',
      output: 'expectTypeOf(true).toBeBoolean()',
      errors: [
        {
          messageId: 'preferExpectTypeOf',
          data: {
            value: 'true',
            matcher: 'toBeBoolean',
            type: 'boolean',
          },
        },
      ],
    },
    {
      code: 'expect(typeof variable).toBe("object")',
      output: 'expectTypeOf(variable).toBeObject()',
      errors: [
        {
          messageId: 'preferExpectTypeOf',
          data: {
            value: 'variable',
            matcher: 'toBeObject',
            type: 'object',
          },
        },
      ],
    },
    {
      code: 'expect(typeof fn).toBe("function")',
      output: 'expectTypeOf(fn).toBeFunction()',
      errors: [
        {
          messageId: 'preferExpectTypeOf',
          data: {
            value: 'fn',
            matcher: 'toBeFunction',
            type: 'function',
          },
        },
      ],
    },
    {
      code: 'expect(typeof value).toEqual("string")',
      output: 'expectTypeOf(value).toBeString()',
      errors: [
        {
          messageId: 'preferExpectTypeOf',
          data: {
            value: 'value',
            matcher: 'toBeString',
            type: 'string',
          },
        },
      ],
    },
    {
      code: 'expect(typeof value).not.toBe("string")',
      output: 'expectTypeOf(value).not.toBeString()',
      errors: [
        {
          messageId: 'preferExpectTypeOf',
          data: {
            value: 'value',
            matcher: 'toBeString',
            type: 'string',
          },
        },
      ],
    },
  ],
})
