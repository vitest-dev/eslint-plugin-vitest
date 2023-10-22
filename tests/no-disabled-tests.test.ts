import rule, { RULE_NAME } from '../src/rules/no-disabled-tests'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
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
    // eslint-disable-next-line no-template-curly-in-string
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

				test('something');`
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
          messageId: 'disabledSuite'
        }
      ]
    },
    {
      code: 'it("contains a call to pending", function () { pending() })',
      errors: [
        {
          column: 48,
          endColumn: 57,
          endLine: 1,
          line: 1,
          messageId: 'pendingTest'
        }
      ]
    },
    {
      code: 'xtest("foo", function () {})',
      errors: [
        {
          column: 1,
          endColumn: 6,
          endLine: 1,
          line: 1,
          messageId: 'disabledTest'
        }
      ]
    },
    {
      code: 'xit.each``("foo", function () {})',
      errors: [
        {
          column: 1,
          endColumn: 4,
          endLine: 1,
          line: 1,
          messageId: 'disabledTest'
        }
      ]
    },
    {
      code: 'xtest.each``("foo", function () {})',
      errors: [
        {
          column: 1,
          endColumn: 6,
          endLine: 1,
          line: 1,
          messageId: 'disabledTest'
        }
      ]
    },
    {
      code: 'xit.each([])("foo", function () {})',
      errors: [
        {
          column: 1,
          endColumn: 4,
          endLine: 1,
          line: 1,
          messageId: 'disabledTest'
        }
      ]
    },
    {
      code: 'it("has title but no callback")',
      errors: [
        {
          column: 1,
          endColumn: 32,
          endLine: 1,
          line: 1,
          messageId: 'missingFunction'
        }
      ]
    },
    {
      code: 'test("has title but no callback")',
      errors: [
        {
          column: 1,
          endColumn: 34,
          endLine: 1,
          line: 1,
          messageId: 'missingFunction'
        }
      ]
    },
    {
      code: 'it("contains a call to pending", function () { pending() })',
      errors: [
        {
          column: 48,
          endColumn: 57,
          endLine: 1,
          line: 1,
          messageId: 'pendingTest'
        }
      ]
    },
    {
      code: 'pending();',
      errors: [
        {
          column: 1,
          endColumn: 10,
          endLine: 1,
          line: 1,
          messageId: 'pending'
        }
      ]
    }
  ]
})
