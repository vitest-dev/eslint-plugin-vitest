import rule from '../src/rules/prefer-importing-vitest-globals'
import { ruleTester } from './ruleTester'

ruleTester.run(rule.name, rule, {
  valid: [
    "vitest.describe('suite', () => {});",
    "import { describe } from 'vitest'; describe('suite', () => {});",
    "import { describe, it } from 'vitest'; describe('suite', () => {});",
    "import { describe, desccribe } from 'vitest'; describe('suite', () => {});",
    "const { describe } = require('vitest'); describe('suite', () => {});",
    "const { describe, it } = require('vitest'); describe('suite', () => {});",
    "const { describe, describe } = require('vitest'); describe('suite', () => {});",
    "import { assert } from 'node:assert'; assert(true);",
    "import assert from 'node:assert'; assert(true);",
    "import { it } from 'vitest'; import { assert } from 'node:assert'; it('test', () => { assert(true); });",
    "import { it } from 'vitest'; import { expect } from 'chai'; it('test', () => { expect(1).to.equal(1); });",
    "import { describe } from 'jest'; describe('suite', () => {});",
    "import { describe, expect, it } from 'vitest'; describe('suite', () => { it('test', () => { let test = 5; expect(test).toBe(5); }); });",
    "import { describe, expect, it } from 'vitest'; describe('suite', () => { it('test', () => { const test = () => true; expect(test()).toBe(true); }); });",
    "import { describe, expect, it } from 'vitest'; describe('suite', () => { it('test', () => { function fn(test) { return test; } expect(fn(5)).toBe(5); }); });",
  ],
  invalid: [
    {
      code: "describe('suite', () => {});",
      errors: [
        {
          messageId: 'preferImportingVitestGlobals',
          data: { name: 'describe' },
        },
      ],
      output:
        "import { describe } from 'vitest';\ndescribe('suite', () => {});",
    },
    {
      code: "import { it } from 'vitest';\ndescribe('suite', () => {});",
      errors: [
        {
          messageId: 'preferImportingVitestGlobals',
          data: { name: 'describe' },
        },
      ],
      output:
        "import { it, describe } from 'vitest';\ndescribe('suite', () => {});",
    },
    {
      code: "import { it } from 'vitest';\nimport { assert } from 'node:assert';\nit('test', () => { assert(true); expect(1).toBe(1); });",
      errors: [
        {
          messageId: 'preferImportingVitestGlobals',
          data: { name: 'expect' },
        },
      ],
      output:
        "import { it, expect } from 'vitest';\nimport { assert } from 'node:assert';\nit('test', () => { assert(true); expect(1).toBe(1); });",
    },
    {
      code: "import vitest from 'vitest';\ndescribe('suite', () => {});",
      errors: [
        {
          messageId: 'preferImportingVitestGlobals',
          data: { name: 'describe' },
        },
      ],
      output:
        "import vitest, { describe } from 'vitest';\ndescribe('suite', () => {});",
    },
    {
      code: "import * as abc from 'vitest';\ndescribe('suite', () => {});",
      errors: [
        {
          messageId: 'preferImportingVitestGlobals',
          data: { name: 'describe' },
        },
      ],
      output:
        "import { describe } from 'vitest';\nimport * as abc from 'vitest';\ndescribe('suite', () => {});",
    },
    {
      code: "import { \"default\" as vitest } from 'vitest'; describe('suite', () => {});",
      errors: [
        {
          messageId: 'preferImportingVitestGlobals',
          data: { name: 'describe' },
        },
      ],
      output:
        "import { \"default\" as vitest, describe } from 'vitest'; describe('suite', () => {});",
    },
    {
      code: "const x = require('something', 'else'); describe('suite', () => {});",
      errors: [
        {
          messageId: 'preferImportingVitestGlobals',
          data: { name: 'describe' },
        },
      ],
      output:
        "import { describe } from 'vitest';\nconst x = require('something', 'else'); describe('suite', () => {});",
    },
    {
      code: "const x = require('jest'); describe('suite', () => {});",
      errors: [
        {
          messageId: 'preferImportingVitestGlobals',
          data: { name: 'describe' },
        },
      ],
      output:
        "import { describe } from 'vitest';\nconst x = require('jest'); describe('suite', () => {});",
    },
    {
      code: "const vitest = require('vitest'); describe('suite', () => {});",
      errors: [
        {
          messageId: 'preferImportingVitestGlobals',
          data: { name: 'describe' },
        },
      ],
      output:
        "import { describe } from 'vitest';\nconst vitest = require('vitest'); describe('suite', () => {});",
    },
    {
      code: "const { ...rest } = require('vitest'); describe('suite', () => {});",
      errors: [
        {
          messageId: 'preferImportingVitestGlobals',
          data: { name: 'describe' },
        },
      ],
      output:
        "const { ...rest, describe } = require('vitest'); describe('suite', () => {});",
    },
    {
      code: "const { \"default\": vitest } = require('vitest'); describe('suite', () => {});",
      errors: [
        {
          messageId: 'preferImportingVitestGlobals',
          data: { name: 'describe' },
        },
      ],
      output:
        "const { \"default\": vitest, describe } = require('vitest'); describe('suite', () => {});",
    },
    {
      code: "const { it } = require('vitest');\ndescribe('suite', () => {});",
      errors: [
        {
          messageId: 'preferImportingVitestGlobals',
          data: { name: 'describe' },
        },
      ],
      output:
        "const { it, describe } = require('vitest');\ndescribe('suite', () => {});",
    },
  ],
})
