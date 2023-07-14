import { describe, it } from 'vitest'
import { ruleTester } from '../utils/test'
import rule, { RULE_NAME } from './no-commented-out-tests'

describe(RULE_NAME, () => {
  it(RULE_NAME, () => {
    ruleTester.run(RULE_NAME, rule, {
      valid: [
        '// foo("bar", function () {})',
        'describe("foo", function () {})',
        'it("foo", function () {})',
        'describe.only("foo", function () {})',
        'it.only("foo", function () {})',
        'it.concurrent("foo", function () {})',
        'test("foo", function () {})',
        'test.only("foo", function () {})',
        'test.concurrent("foo", function () {})',
        'var appliedSkip = describe.skip; appliedSkip.apply(describe)',
        'var calledSkip = it.skip; calledSkip.call(it)',
        '({ f: function () {} }).f()',
        '(a || b).f()',
        'itHappensToStartWithIt()',
        'testSomething()',
        '// latest(dates)',
        '// TODO: unify with Git implementation from Shipit (?)',
        '#!/usr/bin/env node'
      ],
      invalid: [
        {
          code: '// describe(\'foo\', function () {})\'',
          errors: [
            {
              messageId: 'noCommentedOutTests'
            }
          ]
        },
        {
          code: '// test.concurrent("foo", function () {})',
          errors: [{ messageId: 'noCommentedOutTests', column: 1, line: 1 }]
        },
        {
          code: '// test["skip"]("foo", function () {})',
          errors: [{ messageId: 'noCommentedOutTests', column: 1, line: 1 }]
        },
        {
          code: '// xdescribe("foo", function () {})',
          errors: [{ messageId: 'noCommentedOutTests', column: 1, line: 1 }]
        },
        {
          code: '// xit("foo", function () {})',
          errors: [{ messageId: 'noCommentedOutTests', column: 1, line: 1 }]
        },
        {
          code: '// fit("foo", function () {})',
          errors: [{ messageId: 'noCommentedOutTests', column: 1, line: 1 }]
        },
        {
          code: ` // test(
						//   "foo", function () {}
						// )`,
          errors: [{ messageId: 'noCommentedOutTests', column: 2, line: 1 }]
        }
      ]
    })
  })
})
