import { it, describe } from 'vitest'
import { ruleTester } from '../utils/test'
import rule, { RULE_NAME } from './prefer-to-be'

describe(RULE_NAME, () => {
  it(`${RULE_NAME} toBe`, () => {
    ruleTester.run(RULE_NAME, rule, {
      valid: [
        'expect(null).toBeNull();',
        'expect(null).not.toBeNull();',
        'expect(null).toBe(1);',
        'expect(null).toBe(-1);',
        'expect(null).toBe(1);',
        'expect(obj).toStrictEqual([ x, 1 ]);',
        'expect(obj).toStrictEqual({ x: 1 });',
        'expect(obj).not.toStrictEqual({ x: 1 });',
        'expect(value).toMatchSnapshot();',
        'expect(catchError()).toStrictEqual({ message: \'oh noes!\' })',
        'expect("something");',
        'expect(token).toStrictEqual(/[abc]+/g);',
        'expect(token).toStrictEqual(new RegExp(\'[abc]+\', \'g\'));',
        'expect(0.1 + 0.2).toEqual(0.3);'
      ],
      invalid: [
        {
          code: 'expect(value).toEqual("my string");',
          output: 'expect(value).toBe("my string");',
          errors: [{ messageId: 'useToBe' }]
        },
        {
          code: 'expect("a string").not.toEqual(null);',
          output: 'expect("a string").not.toBeNull();',
          errors: [{ messageId: 'useToBeNull', column: 24, line: 1 }]
        },
        {
          code: 'expect("a string").not.toStrictEqual(null);',
          output: 'expect("a string").not.toBeNull();',
          errors: [{ messageId: 'useToBeNull', column: 24, line: 1 }]
        }
      ]
    })
  })

  it(`${RULE_NAME} NaN`, () => {
    ruleTester.run(RULE_NAME, rule, {
      valid: [
        'expect(NaN).toBeNaN();',
        'expect(true).not.toBeNaN();',
        'expect({}).toEqual({});',
        'expect(something).toBe()',
        'expect(something).toBe(somethingElse)',
        'expect(something).toEqual(somethingElse)',
        'expect(something).not.toBe(somethingElse)',
        'expect(something).not.toEqual(somethingElse)',
        'expect(undefined).toBe',
        'expect("something");'
      ],
      invalid: [
        {
          code: 'expect(NaN).toBe(NaN);',
          output: 'expect(NaN).toBeNaN();',
          errors: [{ messageId: 'useToBeNaN', column: 13, line: 1 }]
        },
        {
          code: 'expect("a string").not.toBe(NaN);',
          output: 'expect("a string").not.toBeNaN();',
          errors: [{ messageId: 'useToBeNaN', column: 24, line: 1 }]
        },
        {
          code: 'expect("a string").not.toStrictEqual(NaN);',
          output: 'expect("a string").not.toBeNaN();',
          errors: [{ messageId: 'useToBeNaN', column: 24, line: 1 }]
        }
      ]
    })
  })

  it(`${RULE_NAME} null`, () => {
    ruleTester.run(RULE_NAME, rule, {
      valid: [
        'expect(null).toBeNull();',
        'expect(null).not.toBeNull();',
        'expect(null).toBe(1);',
        'expect(obj).toStrictEqual([ x, 1 ]);',
        'expect(obj).toStrictEqual({ x: 1 });',
        'expect(obj).not.toStrictEqual({ x: 1 });'
      ],
      invalid: [
        {
          code: 'expect(null).toBe(null);',
          output: 'expect(null).toBeNull();',
          errors: [{ messageId: 'useToBeNull', column: 14, line: 1 }]
        },
        {
          code: 'expect(null).toEqual(null);',
          output: 'expect(null).toBeNull();',
          parserOptions: { ecmaVersion: 2017 },
          errors: [{ messageId: 'useToBeNull', column: 14, line: 1 }]
        },
        {
          code: 'expect("a string").not.toEqual(null as number);',
          output: 'expect("a string").not.toBeNull();',
          errors: [{ messageId: 'useToBeNull', column: 24, line: 1 }]
        },
        {
          code: 'expect(undefined).toBe(undefined as unknown as string as any);',
          output: 'expect(undefined).toBeUndefined();',
          errors: [{ messageId: 'useToBeUndefined', column: 19, line: 1 }]
        },
        {
          code: 'expect("a string").toEqual(undefined as number);',
          output: 'expect("a string").toBeUndefined();',
          errors: [{ messageId: 'useToBeUndefined', column: 20, line: 1 }]
        }
      ]
    })
  })
})
