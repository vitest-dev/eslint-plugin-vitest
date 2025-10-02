import rule, { RULE_NAME } from '../src/rules/prefer-import-in-mock'
import { ruleTester } from './ruleTester'

describe(RULE_NAME, () => {
  ruleTester.run(RULE_NAME, rule, {
    valid: ['vi.mock(import("foo"))'],
    invalid: [
      {
        code: `vi.mock('foo', () => {})`,
        errors: [
          {
            messageId: 'preferImport',
          },
        ],
        output: `vi.mock(import('foo'), () => {})`,
      },
    ],
  })
})
