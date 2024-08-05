import rule, { RULE_NAME } from '../src/rules/prefer-todo'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'test()',
    'test.concurrent()',
    'test.todo("i need to write this test");',
    'test(obj)',
    'test.concurrent(obj)',
    'fit("foo")',
    'fit.concurrent("foo")',
    'xit("foo")',
    'test("foo", 1)',
    'test("stub", () => expect(1).toBe(1));',
    'test.concurrent("stub", () => expect(1).toBe(1));',
    `
      supportsDone && params.length < test.length
     ? done => test(...params, done)
     : () => test(...params);
    `
  ],
  invalid: [
    {
      code: 'test("i need to write this test");',
      output: 'test.todo("i need to write this test");',
      errors: [{ messageId: 'unimplementedTest' }]
    },
    {
      code: 'test("i need to write this test",);',
      output: 'test.todo("i need to write this test",);',
      languageOptions: { parserOptions: { ecmaVersion: 2017 } },
      errors: [{ messageId: 'unimplementedTest' }]
    },
    {
      code: 'test(`i need to write this test`);',
      output: 'test.todo(`i need to write this test`);',
      errors: [{ messageId: 'unimplementedTest' }]
    },
    {
      code: 'it("foo", function () {})',
      output: 'it.todo("foo")',
      errors: [{ messageId: 'emptyTest' }]
    },
    {
      code: 'it("foo", () => {})',
      output: 'it.todo("foo")',
      errors: [{ messageId: 'emptyTest' }]
    },
    {
      code: 'test.skip("i need to write this test", () => {});',
      output: 'test.todo("i need to write this test");',
      errors: [{ messageId: 'emptyTest' }]
    },
    {
      code: 'test.skip("i need to write this test", function() {});',
      output: 'test.todo("i need to write this test");',
      errors: [{ messageId: 'emptyTest' }]
    },
    {
      code: 'test["skip"]("i need to write this test", function() {});',
      output: 'test[\'todo\']("i need to write this test");',
      errors: [{ messageId: 'emptyTest' }]
    },
    {
      code: 'test[`skip`]("i need to write this test", function() {});',
      output: 'test[\'todo\']("i need to write this test");',
      errors: [{ messageId: 'emptyTest' }]
    }
  ]
})
