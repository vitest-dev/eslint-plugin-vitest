import rule, { RULE_NAME } from '../src/rules/no-restricted-vi-methods'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'vi',
    'vi()',
    'vi.mock()',
    'expect(a).rejects;',
    'expect(a);',
    {
      code: `
     import { vi } from 'vitest';
     vi;
    `,
      languageOptions: { parserOptions: { sourceType: 'module' } }
    }
  ],

  invalid: [
    {
      code: 'vi.fn()',
      options: [{ fn: null }],
      errors: [
        {
          messageId: 'restrictedViMethod',
          data: {
            message: null,
            restriction: 'fn'
          },
          column: 4,
          line: 1
        }
      ]
    },
    {
      code: 'vi.mock()',
      options: [{ mock: 'Do not use mocks' }],
      errors: [
        {
          messageId: 'restrictedViMethodWithMessage',
          data: {
            message: 'Do not use mocks',
            restriction: 'mock'
          },
          column: 4,
          line: 1
        }
      ]
    },
    {
      code: `
     import { vi } from 'vitest';
     vi.advanceTimersByTime();
    `,
      options: [{ advanceTimersByTime: null }],
      languageOptions: { parserOptions: { sourceType: 'module' } },
      errors: [
        {
          messageId: 'restrictedViMethod',
          data: {
            message: null,
            restriction: 'advanceTimersByTime'
          },
          column: 9,
          line: 3
        }
      ]
    },
    {
      code: 'vi["fn"]()',
      options: [{ fn: null }],
      errors: [
        {
          messageId: 'restrictedViMethod',
          data: {
            message: null,
            restriction: 'fn'
          },
          column: 4,
          line: 1
        }
      ]
    }
  ]
})
