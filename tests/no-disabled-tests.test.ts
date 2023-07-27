import { describe, it } from 'vitest'
import rule, { RULE_NAME } from '../src/rules/no-disabled-tests'
import { ruleTester } from './ruleTester'

describe(RULE_NAME, () => {
	it(RULE_NAME, () => {
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
							messageId: 'disabledSuite'
						}
					]
				},
				{
					code: 'it("contains a call to pending", function () { pending() })',
					errors: [{ messageId: 'pendingTest', column: 48, line: 1 }]
				},
				{
					code: 'xtest("foo", function () {})',
					errors: [{ messageId: 'disabledTest', column: 1, line: 1 }]
				},
				{
					code: 'xit.each``("foo", function () {})',
					errors: [{ messageId: 'disabledTest', column: 1, line: 1 }]
				},
				{
					code: 'xtest.each``("foo", function () {})',
					errors: [{ messageId: 'disabledTest', column: 1, line: 1 }]
				},
				{
					code: 'xit.each([])("foo", function () {})',
					errors: [{ messageId: 'disabledTest', column: 1, line: 1 }]
				},
				{
					code: 'it("has title but no callback")',
					errors: [{ messageId: 'missingFunction', column: 1, line: 1 }]
				},
				{
					code: 'test("has title but no callback")',
					errors: [{ messageId: 'missingFunction', column: 1, line: 1 }]
				},
				{
					code: 'it("contains a call to pending", function () { pending() })',
					errors: [{ messageId: 'pendingTest', column: 48, line: 1 }]
				},
				{
					code: 'pending();',
					errors: [{ messageId: 'pending', column: 1, line: 1 }]
				}
			]
		})
	})
})
