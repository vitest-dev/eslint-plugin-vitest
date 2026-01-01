import rule from '../src/rules/no-disabled-tests'
import { ruleTester } from './ruleTester'

ruleTester.run(rule.name, rule, {
  valid: [
    'describe("foo", function () {})',
    'it("foo", function () {})',
    'describe.only("foo", function () {})',
    'it.only("foo", function () {})',
    'it.each("foo", () => {})',
    'it.concurrent("foo", function () {})',
    'test("foo", function () {})',
    'test.only("foo", function () {})',
    'test.concurrent("foo", function () {})',
    'describe[`${"skip"}`]("foo", function () {})',
    'it.todo("fill this later")',
    'var appliedSkip = describe.skip; appliedSkip.apply(describe)',
    'var calledSkip = it.skip; calledSkip.call(it)',
    '({ f: function () {} }).f()',
    '(a || b).f()',
    'itHappensToStartWithIt()',
    'testSomething()',
    'xitSomethingElse()',
    'xitiViewMap()',
    `import { pending } from "actions"

    test("foo", () => {
      expect(pending()).toEqual({})
    })`,
    `   import { test } from './test-utils';

    test('something');`,
    `test("foo", () => {
      const upper1 = (x: string) => x.toUpperCase();
      const upper2 = (y: string) => y.toUpperCase();
      const upper3 = (xy: string) => xy.toUpperCase();
      const upper4 = (yx: string) => yx.toUpperCase();
      const upper5 = (a: string) => a.toUpperCase();
      const length = (x: string) => x.length;
      expect("test").toBe('test');
    });`,
  ],
  invalid: [
    {
      code: 'describe.skip("foo", function () {})',
      errors: [
        {
          column: 10,
          endColumn: 14,
          endLine: 1,
          line: 1,
          messageId: 'disabledSuite',
        },
      ],
    },
    {
      code: 'xtest("foo", function () {})',
      errors: [
        {
          column: 1,
          endColumn: 6,
          endLine: 1,
          line: 1,
          messageId: 'disabledTest',
        },
      ],
    },
    {
      code: 'xit.each``("foo", function () {})',
      errors: [
        {
          column: 1,
          endColumn: 4,
          endLine: 1,
          line: 1,
          messageId: 'disabledTest',
        },
      ],
    },
    {
      code: 'xtest.each``("foo", function () {})',
      errors: [
        {
          column: 1,
          endColumn: 6,
          endLine: 1,
          line: 1,
          messageId: 'disabledTest',
        },
      ],
    },
    {
      code: 'xit.each([])("foo", function () {})',
      errors: [
        {
          column: 1,
          endColumn: 4,
          endLine: 1,
          line: 1,
          messageId: 'disabledTest',
        },
      ],
    },
    {
      code: 'it("has title but no callback")',
      errors: [
        {
          column: 1,
          endColumn: 32,
          endLine: 1,
          line: 1,
          messageId: 'missingFunction',
        },
      ],
    },
    {
      code: 'test("has title but no callback")',
      errors: [
        {
          column: 1,
          endColumn: 34,
          endLine: 1,
          line: 1,
          messageId: 'missingFunction',
        },
      ],
    },
    {
      code: 'it("contains a call to pending", function () { pending() })',
      errors: [
        {
          column: 48,
          endColumn: 57,
          endLine: 1,
          line: 1,
          messageId: 'pendingTest',
        },
      ],
    },
    {
      code: 'pending();',
      errors: [
        {
          column: 1,
          endColumn: 10,
          endLine: 1,
          line: 1,
          messageId: 'pending',
        },
      ],
    },
  ],
})
