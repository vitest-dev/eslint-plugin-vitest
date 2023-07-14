import { it } from 'vitest'
import { ruleTester } from '../utils/test'
import rule, { RULE_NAME } from './no-restricted-vi-methods'

it(RULE_NAME, () => {
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
        parserOptions: { sourceType: 'module' }
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
        parserOptions: { sourceType: 'module' },
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
})
