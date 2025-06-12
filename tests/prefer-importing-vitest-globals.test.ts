import rule, { RULE_NAME } from '../src/rules/prefer-importing-vitest-globals'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    "vitest.describe('suite', () => {});",
    "min(1, 2);",
    "import { describe } from 'vitest'; describe('suite', () => {});",
    "import { describe, it } from 'vitest'; describe('suite', () => {});",
  ],
  invalid: [
    {
      code: "describe('suite', () => {});",
      errors: [
        { message: "Import 'describe' from 'vitest'" },
      ],
    },
    {
      code: "import { it } from 'vitest'; describe('suite', () => {});",
      errors: [
        { message: "Import 'describe' from 'vitest'" },
      ],
    },
    {
      code: "import { describe } from 'jest'; describe('suite', () => {});",
      errors: [
        { message: "Import 'describe' from 'vitest'" },
      ],
    },
    {
      code: "import vitest from 'vitest'; describe('suite', () => {});",
      errors: [
        { message: "Import 'describe' from 'vitest'" },
      ],
    },
    {
      code: "import * as vitest from 'vitest'; describe('suite', () => {});",
      errors: [
        { message: "Import 'describe' from 'vitest'" },
      ],
    },
    {
      code: "import { \"default\" as vitest } from 'vitest'; describe('suite', () => {});",
      errors: [
        { message: "Import 'describe' from 'vitest'" },
      ],
    },
  ]
});
