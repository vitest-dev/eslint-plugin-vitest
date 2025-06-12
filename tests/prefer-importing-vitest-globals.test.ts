import rule, { RULE_NAME } from '../src/rules/prefer-importing-vitest-globals'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    "vitest.describe('suite', () => {});",
    "import { describe } from 'vitest'; describe('suite', () => {});",
    "import { describe, it } from 'vitest'; describe('suite', () => {});",
    "import { describe, desccribe } from 'vitest'; describe('suite', () => {});",
    "const { describe } = require('vitest'); describe('suite', () => {});",
    "const { describe, it } = require('vitest'); describe('suite', () => {});",
    "const { describe, describe } = require('vitest'); describe('suite', () => {});",
  ],
  invalid: [
    {
      code: "describe('suite', () => {});",
      errors: [
        { message: "Import 'describe' from 'vitest'" },
      ],
      output: "import { describe } from 'vitest';\ndescribe('suite', () => {});",
    },
    {
      code: "import { it } from 'vitest';\ndescribe('suite', () => {});",
      errors: [
        { message: "Import 'describe' from 'vitest'" },
      ],
      output: "import { it, describe } from 'vitest';\ndescribe('suite', () => {});",
    },
    {
      code: "import { describe } from 'jest';\ndescribe('suite', () => {});",
      errors: [
        { message: "Import 'describe' from 'vitest'" },
      ],
      output: "import { describe } from 'vitest';\nimport { describe } from 'jest';\ndescribe('suite', () => {});",
    },
    {
      code: "import vitest from 'vitest';\ndescribe('suite', () => {});",
      errors: [
        { message: "Import 'describe' from 'vitest'" },
      ],
      output: "import vitest, { describe } from 'vitest';\ndescribe('suite', () => {});",
    },
    {
      code: "import * as abc from 'vitest';\ndescribe('suite', () => {});",
      errors: [
        { message: "Import 'describe' from 'vitest'" },
      ],
      output: "import { describe } from 'vitest';\nimport * as abc from 'vitest';\ndescribe('suite', () => {});",
    },
    {
      code: "import { \"default\" as vitest } from 'vitest'; describe('suite', () => {});",
      errors: [
        { message: "Import 'describe' from 'vitest'" },
      ],
      output: "import { \"default\" as vitest, describe } from 'vitest'; describe('suite', () => {});",
    },
    {
      code: "const x = require('something', 'else'); describe('suite', () => {});",
      errors: [
        { message: "Import 'describe' from 'vitest'" },
      ],
      output: "import { describe } from 'vitest';\nconst x = require('something', 'else'); describe('suite', () => {});",
    },
    {
      code: "const x = require('jest'); describe('suite', () => {});",
      errors: [
        { message: "Import 'describe' from 'vitest'" },
      ],
      output: "import { describe } from 'vitest';\nconst x = require('jest'); describe('suite', () => {});",
    },
    {
      code: "const vitest = require('vitest'); describe('suite', () => {});",
      errors: [
        { message: "Import 'describe' from 'vitest'" },
      ],
      output: "import { describe } from 'vitest';\nconst vitest = require('vitest'); describe('suite', () => {});",
    },
    {
      code: "const { ...rest } = require('vitest'); describe('suite', () => {});",
      errors: [
        { message: "Import 'describe' from 'vitest'" },
      ],
      output: "const { ...rest, describe } = require('vitest'); describe('suite', () => {});",
    },
    {
      code: "const { \"default\": vitest } = require('vitest'); describe('suite', () => {});",
      errors: [
        { message: "Import 'describe' from 'vitest'" },
      ],
      output: "const { \"default\": vitest, describe } = require('vitest'); describe('suite', () => {});",
    },
  ]
});
