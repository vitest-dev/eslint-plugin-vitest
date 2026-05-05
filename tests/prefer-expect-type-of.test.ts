import { RuleTester } from '@typescript-eslint/rule-tester'
import rule from '../src/rules/prefer-expect-type-of'

const ruleTester = new RuleTester()

ruleTester.run(rule.name, rule, {
  valid: [
    'expect("name").toBeTypeOf("string")',
    'expect("name").not.toBeTypeOf("string")',
    'expect(12).toBeTypeOf("number")',
    'expect(true).toBeTypeOf("boolean")',
    'expect({a: 1}).toBeTypeOf("object")',
    'expect(() => {}).toBeTypeOf("function")',
    'expect(sym).toBeTypeOf("symbol")',
    'expect(BigInt(123)).toBeTypeOf("bigint")',
    'expect(undefined).toBeTypeOf("undefined")',
    'expect(value).not.toBe(42)',
    'expect(value).not.toEqual(42)',
  ],
  invalid: [
    {
      code: 'expect(typeof 12).toBe("number")',
      output: 'expect(12).toBeTypeOf("number")',
      errors: [
        {
          messageId: 'preferExpectTypeOf',
          data: { value: '12', type: '"number"' },
        },
      ],
    },
    {
      code: 'expect(typeof "name").toBe("string")',
      output: 'expect("name").toBeTypeOf("string")',
      errors: [
        {
          messageId: 'preferExpectTypeOf',
          data: { value: '"name"', type: '"string"' },
        },
      ],
    },
    {
      code: 'expect(typeof true).toBe("boolean")',
      output: 'expect(true).toBeTypeOf("boolean")',
      errors: [
        {
          messageId: 'preferExpectTypeOf',
          data: { value: 'true', type: '"boolean"' },
        },
      ],
    },
    {
      code: 'expect(typeof variable).toBe("object")',
      output: 'expect(variable).toBeTypeOf("object")',
      errors: [
        {
          messageId: 'preferExpectTypeOf',
          data: { value: 'variable', type: '"object"' },
        },
      ],
    },
    {
      code: 'expect(typeof fn).toBe("function")',
      output: 'expect(fn).toBeTypeOf("function")',
      errors: [
        {
          messageId: 'preferExpectTypeOf',
          data: { value: 'fn', type: '"function"' },
        },
      ],
    },
    {
      code: 'expect(typeof sym).toBe("symbol")',
      output: 'expect(sym).toBeTypeOf("symbol")',
      errors: [
        {
          messageId: 'preferExpectTypeOf',
          data: { value: 'sym', type: '"symbol"' },
        },
      ],
    },
    {
      code: 'expect(typeof big).toBe("bigint")',
      output: 'expect(big).toBeTypeOf("bigint")',
      errors: [
        {
          messageId: 'preferExpectTypeOf',
          data: { value: 'big', type: '"bigint"' },
        },
      ],
    },
    {
      code: 'expect(typeof value).toBe("undefined")',
      output: 'expect(value).toBeTypeOf("undefined")',
      errors: [
        {
          messageId: 'preferExpectTypeOf',
          data: { value: 'value', type: '"undefined"' },
        },
      ],
    },
    {
      code: 'expect(typeof value).toEqual("string")',
      output: 'expect(value).toBeTypeOf("string")',
      errors: [
        {
          messageId: 'preferExpectTypeOf',
          data: { value: 'value', type: '"string"' },
        },
      ],
    },
    {
      code: 'expect(typeof value).not.toBe("string")',
      output: 'expect(value).not.toBeTypeOf("string")',
      errors: [
        {
          messageId: 'preferExpectTypeOf',
          data: { value: 'value', type: '"string"' },
        },
      ],
    },
    {
      code: 'expect(typeof value).toBe("unknown")',
      output: 'expect(value).toBeTypeOf("unknown")',
      errors: [
        {
          messageId: 'preferExpectTypeOf',
          data: { value: 'value', type: '"unknown"' },
        },
      ],
    },
    {
      code: 'expect(typeof value).toBe(typeName)',
      output: 'expect(value).toBeTypeOf(typeName)',
      errors: [
        {
          messageId: 'preferExpectTypeOf',
          data: { value: 'value', type: 'typeName' },
        },
      ],
    },
  ],
})
