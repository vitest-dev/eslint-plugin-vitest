import rule from '../src/rules/prefer-comparison-matcher'
import { RuleTester } from '@typescript-eslint/rule-tester'
import { ruleTester } from './ruleTester'

const typedRuleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: `${import.meta.dirname}/fixture`,
      project: `./tsconfig.json`,
    },
  },
})

ruleTester.run(rule.name, rule, {
  valid: [
    'expect.hasAssertions',
    'expect.hasAssertions()',
    'expect.assertions(1)',
    'expect(true).toBe(...true)',
    'expect()',
    'expect({}).toStrictEqual({})',
    'expect(a).to.be.a("string");',
    'expect(a === b).toBe(true)',
    'expect(a !== 2).toStrictEqual(true)',
    'expect(a === b).not.toEqual(true)',
    'expect(a !== "string").toStrictEqual(true)',
    'expect(5 != a).toBe(true)',
    'expect(a == "string").toBe(true)',
    'expect(a == "string").not.toBe(true)',
    "expect().fail('Should not succeed a HTTPS proxy request.');",
  ],
  invalid: [
    {
      code: 'expect(a > b).toBe(true)',
      output: 'expect(a).toBeGreaterThan(b)',
      errors: [
        {
          messageId: 'useToBeComparison',
          data: {
            preferredMatcher: 'toBeGreaterThan',
          },
        },
      ],
    },
    {
      code: 'expect(a < b).toBe(true)',
      output: 'expect(a).toBeLessThan(b)',
      errors: [
        {
          messageId: 'useToBeComparison',
          data: {
            preferredMatcher: 'toBeLessThan',
          },
        },
      ],
    },
    {
      code: 'expect(a >= b).toBe(true)',
      output: 'expect(a).toBeGreaterThanOrEqual(b)',
      errors: [
        {
          messageId: 'useToBeComparison',
          data: {
            preferredMatcher: 'toBeGreaterThanOrEqual',
          },
        },
      ],
    },
    {
      code: 'expect(a <= b).toBe(true)',
      output: 'expect(a).toBeLessThanOrEqual(b)',
      errors: [
        {
          messageId: 'useToBeComparison',
        },
      ],
    },
    {
      code: 'expect(a > b).not.toBe(true)',
      output: 'expect(a).toBeLessThanOrEqual(b)',
      errors: [
        {
          messageId: 'useToBeComparison',
        },
      ],
    },
    {
      code: 'expect(a < b).not.toBe(true)',
      output: 'expect(a).toBeGreaterThanOrEqual(b)',
      errors: [
        {
          messageId: 'useToBeComparison',
        },
      ],
    },
    {
      code: 'expect(a >= b).not.toBe(true)',
      output: 'expect(a).toBeLessThan(b)',
      errors: [
        {
          messageId: 'useToBeComparison',
        },
      ],
    },
  ],
})

typedRuleTester.run(rule.name, rule, {
  valid: [
    {
      code: `
      declare const start: string;
      declare const end: string;
      expect(start < end).toBe(true)
      `,
      settings: { vitest: { typecheck: true } },
    },
    {
      code: `
      declare const a: { at: Date };
      declare const b: { at: Date };
      expect(a.at >= b.at).toBe(true)
      `,
      settings: { vitest: { typecheck: true } },
    },
    {
      code: `
      declare const a: number | undefined;
      declare const b: number;
      expect(a > b).toBe(true)
      `,
      settings: { vitest: { typecheck: true } },
    },
  ],
  invalid: [
    {
      code: `
      declare const start: string;
      declare const end: string;
      expect(start < end).toBe(true)
      `,
      output: `
      declare const start: string;
      declare const end: string;
      expect(start).toBeLessThan(end)
      `,
      errors: [{ messageId: 'useToBeComparison' }],
    },
    {
      code: `
      declare const a: number;
      declare const b: 1 | 2;
      expect(a > b).toBe(true)
      `,
      output: `
      declare const a: number;
      declare const b: 1 | 2;
      expect(a).toBeGreaterThan(b)
      `,
      errors: [{ messageId: 'useToBeComparison' }],
      settings: { vitest: { typecheck: true } },
    },
    {
      code: `
      declare const a: bigint;
      declare const b: any;
      expect(a <= b).not.toBe(true)
      `,
      output: `
      declare const a: bigint;
      declare const b: any;
      expect(a).toBeGreaterThan(b)
      `,
      errors: [{ messageId: 'useToBeComparison' }],
      settings: { vitest: { typecheck: true } },
    },
  ],
})
