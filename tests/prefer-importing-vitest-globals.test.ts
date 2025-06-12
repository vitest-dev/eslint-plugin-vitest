import rule, { RULE_NAME } from '../src/rules/prefer-importing-vitest-globals'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    "vitest.describe('suite', () => {});",
  ],
  invalid: [
    {
      code: "describe('suite', () => {});",
      errors: [
        { message: "Import 'TODO' from 'vitest'" },
      ],
    },
  ]
});
