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
    // {
    //   code: "import vitest from 'vitest'; describe('suite', () => {});",
    //   errors: [
    //     { message: "Import 'describe' from 'vitest'" },
    //   ],
    // },
    // {
    //   code: "import * as vitest from 'vitest'; describe('suite', () => {});",
    //   errors: [
    //     { message: "Import 'describe' from 'vitest'" },
    //   ],
    // },
    // {
    //   code: "import { \"default\" as vitest } from 'vitest'; describe('suite', () => {});",
    //   errors: [
    //     { message: "Import 'describe' from 'vitest'" },
    //   ],
    // },
    // {
    //   code: "const x = require('something', 'wrong'); describe('suite', () => {});",
    //   errors: [
    //     { message: "Import 'describe' from 'vitest'" },
    //   ],
    // },
    // {
    //   code: "const x = require('jest'); describe('suite', () => {});",
    //   errors: [
    //     { message: "Import 'describe' from 'vitest'" },
    //   ],
    // },
    // {
    //   code: "const vitest = require('vitest'); describe('suite', () => {});",
    //   errors: [
    //     { message: "Import 'describe' from 'vitest'" },
    //   ],
    // },
    // {
    //   code: "const { ...rest } = require('vitest'); describe('suite', () => {});",
    //   errors: [
    //     { message: "Import 'describe' from 'vitest'" },
    //   ],
    // },
    // {
    //   code: "const { \"default\": vitest } = require('vitest'); describe('suite', () => {});",
    //   errors: [
    //     { message: "Import 'describe' from 'vitest'" },
    //   ],
    // },
  ]
});
