import rule from '../src/rules/consistent-test-it'
import { TestCaseName } from '../src/utils/types'
import { ruleTester } from './ruleTester'

ruleTester.run(rule.name, rule, {
  valid: [
    {
      code: `it("shows error", () => {
  expect(true).toBe(false);
        });`,
      options: [{ fn: TestCaseName.it }],
    },
    {
      code: `it("foo", function () {
         expect(true).toBe(false);
     })`,
      options: [{ fn: TestCaseName.it }],
    },
    {
      code: ` it('foo', () => {
      expect(true).toBe(false);
  });
  function myTest() { if ('bar') {} }`,
      options: [{ fn: TestCaseName.it }],
    },
    {
      code: `bench("foo", function () {
        fibonacci(10);
     })`,
      options: [{ fn: TestCaseName.it }],
    },
  ],
  invalid: [
    {
      code: 'test("shows error", () => {});',
      options: [{ fn: TestCaseName.it }],
      output: 'it("shows error", () => {});',
      errors: [{ messageId: 'consistentMethod' }],
    },
    {
      code: 'test.skip("shows error");',
      output: 'it.skip("shows error");',
      options: [{ fn: TestCaseName.it }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: {
            testFnKeyWork: TestCaseName.it,
            oppositeTestKeyword: TestCaseName.test,
          },
        },
      ],
    },
    {
      code: "test.only('shows error');",
      output: "it.only('shows error');",
      options: [{ fn: TestCaseName.it }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: {
            testFnKeyWork: TestCaseName.it,
            oppositeTestKeyword: TestCaseName.test,
          },
        },
      ],
    },
    {
      code: "describe('foo', () => { it('bar', () => {}); });",
      output: "describe('foo', () => { test('bar', () => {}); });",
      options: [{ fn: TestCaseName.it, withinDescribe: TestCaseName.test }],
      errors: [
        {
          messageId: 'consistentMethodWithinDescribe',
          data: {
            testKeywordWithinDescribe: TestCaseName.test,
            oppositeTestKeyword: TestCaseName.it,
          },
        },
      ],
    },
    {
      code: 'import { test } from "vitest"\ntest("shows error", () => {});',
      options: [{ fn: TestCaseName.it }],
      output: 'import { it } from "vitest"\nit("shows error", () => {});',
      errors: [
        { messageId: 'consistentMethod' },
        { messageId: 'consistentMethod' },
      ],
    },
    {
      code: 'import { expect, test, it } from "vitest"\ntest("shows error", () => {});',
      options: [{ fn: TestCaseName.it }],
      output:
        'import { expect, it } from "vitest"\nit("shows error", () => {});',
      errors: [
        {
          messageId: 'consistentMethod',
          data: {
            testFnKeyWork: TestCaseName.it,
            oppositeTestKeyword: TestCaseName.test,
          },
          line: 1,
          column: 18,
          endColumn: 22,
        },
        {
          messageId: 'consistentMethod',
          data: {
            testFnKeyWork: TestCaseName.it,
            oppositeTestKeyword: TestCaseName.test,
          },
          line: 2,
          column: 1,
          endColumn: 5,
        },
      ],
    },
  ],
})

ruleTester.run(rule.name, rule, {
  valid: [
    {
      code: `test("shows error", () => {
      expect(true).toBe(false);
     });`,
      options: [{ fn: TestCaseName.test }],
    },
    {
      code: 'test.skip("foo")',
      options: [{ fn: TestCaseName.test }],
    },
    {
      code: 'test.concurrent("foo")',
      options: [{ fn: TestCaseName.test }],
    },
    {
      code: 'xtest("foo")',
      options: [{ fn: TestCaseName.test }],
    },
    {
      code: 'test.each([])("foo")',
      options: [{ fn: TestCaseName.test }],
    },
    {
      code: 'test.each``("foo")',
      options: [{ fn: TestCaseName.test }],
    },
    {
      code: 'describe("suite", () => { test("foo") })',
      options: [{ fn: TestCaseName.test }],
    },
    // https://github.com/vitest-dev/eslint-plugin-vitest/issues/956
    {
      code: `import { describe, test } from 'vitest';
const it = test.extend({});
describe("suite", () => { it("foo") })`,
      options: [{ fn: TestCaseName.test, withinDescribe: TestCaseName.it }],
    },
    {
      code: `import { describe, it } from 'vitest';
const test = it.extend({});
describe("suite", () => { test("foo") })`,
      options: [{ fn: TestCaseName.it, withinDescribe: TestCaseName.test }],
    },
  ],
  invalid: [
    {
      code: 'it("shows error", () => {});',
      options: [{ fn: TestCaseName.test }],
      output: 'test("shows error", () => {});',
      errors: [{ messageId: 'consistentMethod' }],
    },
    // https://github.com/vitest-dev/eslint-plugin-vitest/issues/956
    // still reported, but not auto-fixed: `it` is the extended binding, so
    // rewriting it to `test` would call a different function.
    {
      code: `import { test } from 'vitest';
const it = test.extend({});
it("foo")`,
      options: [{ fn: TestCaseName.test }],
      output: null,
      errors: [{ messageId: 'consistentMethod' }],
    },
    {
      code: `import { describe, test } from 'vitest';
const myTest = test.extend({});
describe("suite", () => { myTest("foo") })`,
      options: [{ fn: TestCaseName.test, withinDescribe: TestCaseName.it }],
      output: null,
      errors: [{ messageId: 'consistentMethodWithinDescribe' }],
    },
    {
      code: 'describe("suite", () => { it("foo") })',
      output: 'describe("suite", () => { test("foo") })',
      options: [{ fn: TestCaseName.test }],
      errors: [
        {
          messageId: 'consistentMethodWithinDescribe',
          data: {
            testKeywordWithinDescribe: TestCaseName.test,
            oppositeTestKeyword: TestCaseName.it,
          },
        },
      ],
    },
  ],
})

ruleTester.run(rule.name, rule, {
  valid: [
    {
      code: 'describe("suite", () => { it("foo") })',
      options: [{ fn: TestCaseName.it, withinDescribe: TestCaseName.it }],
    },
    {
      code: 'it("foo")',
      options: [{ fn: TestCaseName.it, withinDescribe: TestCaseName.it }],
    },
  ],
  invalid: [
    {
      code: 'describe("suite", () => { test("foo") })',
      output: 'describe("suite", () => { it("foo") })',
      options: [{ fn: TestCaseName.it, withinDescribe: TestCaseName.it }],
      errors: [
        {
          messageId: 'consistentMethodWithinDescribe',
          data: {
            testKeywordWithinDescribe: TestCaseName.it,
            oppositeTestKeyword: TestCaseName.test,
          },
        },
      ],
    },
    {
      code: 'test("foo")',
      output: 'it("foo")',
      options: [{ fn: TestCaseName.it, withinDescribe: TestCaseName.it }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: {
            testFnKeyWork: TestCaseName.it,
            oppositeTestKeyword: TestCaseName.test,
          },
        },
      ],
    },
  ],
})

ruleTester.run(rule.name, rule, {
  valid: [
    {
      code: 'test("shows error", () => {});',
    },
  ],
  invalid: [
    {
      code: 'describe("suite", () => { test("foo") })',
      output: 'describe("suite", () => { it("foo") })',
      errors: [
        {
          messageId: 'consistentMethodWithinDescribe',
          data: {
            testKeywordWithinDescribe: TestCaseName.it,
            oppositeTestKeyword: TestCaseName.test,
          },
        },
      ],
    },
  ],
})

ruleTester.run(rule.name, rule, {
  valid: [
    {
      code: 'test("foo")',
      options: [{ withinDescribe: TestCaseName.it }],
    },
    {
      code: 'describe("suite", () => { it("foo") })',
      options: [{ withinDescribe: TestCaseName.it }],
    },
  ],
  invalid: [
    {
      code: 'it("foo")',
      output: 'test("foo")',
      options: [{ withinDescribe: TestCaseName.it }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: {
            testFnKeyWork: TestCaseName.test,
            oppositeTestKeyword: TestCaseName.it,
          },
        },
      ],
    },
    {
      code: 'describe("suite", () => { test("foo") })',
      output: 'describe("suite", () => { it("foo") })',
      options: [{ withinDescribe: TestCaseName.it }],
      errors: [
        {
          messageId: 'consistentMethodWithinDescribe',
          data: {
            testKeywordWithinDescribe: TestCaseName.it,
            oppositeTestKeyword: TestCaseName.test,
          },
        },
      ],
    },
  ],
})

ruleTester.run(rule.name, rule, {
  valid: [
    {
      code: 'test("foo")',
      options: [{ withinDescribe: TestCaseName.test }],
    },
    {
      code: 'describe("suite", () => { test("foo") })',
      options: [{ withinDescribe: TestCaseName.test }],
    },
  ],
  invalid: [
    {
      code: 'it("foo")',
      output: 'test("foo")',
      options: [{ withinDescribe: TestCaseName.test }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: {
            testFnKeyWork: TestCaseName.test,
            oppositeTestKeyword: TestCaseName.it,
          },
        },
      ],
    },
    {
      code: 'import { it } from "vitest"\nit("foo")',
      output: 'import { test } from "vitest"\ntest("foo")',
      options: [{ withinDescribe: TestCaseName.test }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: {
            testFnKeyWork: TestCaseName.test,
            oppositeTestKeyword: TestCaseName.it,
          },
          line: 1,
          column: 10,
          endColumn: 12,
        },
        {
          messageId: 'consistentMethod',
          data: {
            testFnKeyWork: TestCaseName.test,
            oppositeTestKeyword: TestCaseName.it,
          },
          line: 2,
          column: 1,
          endColumn: 3,
        },
      ],
    },
    {
      code: 'import { it as baseIt, test } from "vitest"\nbaseIt("foo")',
      output: 'import { it as baseIt } from "vitest"\nbaseIt("foo")',
      options: [{ fn: TestCaseName.it }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: {
            testFnKeyWork: TestCaseName.it,
            oppositeTestKeyword: TestCaseName.test,
          },
          column: 24,
          endColumn: 28,
          line: 1,
        },
      ],
    },
    {
      code: 'import { expect, it, test } from "vitest"\nit("foo")',
      output: 'import { expect, test } from "vitest"\ntest("foo")',
      options: [{ withinDescribe: TestCaseName.test }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: {
            testFnKeyWork: TestCaseName.test,
            oppositeTestKeyword: TestCaseName.it,
          },
          line: 1,
          column: 18,
          endColumn: 20,
        },
        {
          messageId: 'consistentMethod',
          data: {
            testFnKeyWork: TestCaseName.test,
            oppositeTestKeyword: TestCaseName.it,
          },
          line: 2,
          column: 1,
          endColumn: 3,
        },
      ],
    },
    {
      code: 'describe("suite", () => { it("foo") })',
      output: 'describe("suite", () => { test("foo") })',
      options: [{ withinDescribe: TestCaseName.test }],
      errors: [
        {
          messageId: 'consistentMethodWithinDescribe',
          data: {
            testKeywordWithinDescribe: TestCaseName.test,
            oppositeTestKeyword: TestCaseName.it,
          },
        },
      ],
    },
  ],
})
