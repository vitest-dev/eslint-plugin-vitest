import rule, { RULE_NAME } from '../src/rules/warn-todo'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'describe("foo", function () {})',
    'it("foo", function () {})',
    'it.concurrent("foo", function () {})',
    'test("foo", function () {})',
    'test.concurrent("foo", function () {})',
    'describe.only("foo", function () {})',
    'it.only("foo", function () {})',
    'it.each()("foo", function () {})',
  ],
  invalid: [
    {
      code: 'describe.todo("foo", function () {})',
      errors: [{ messageId: 'warnTodo', column: 10, line: 1 }],
    },
    {
      code: 'it.todo("foo", function () {})',
      errors: [{ messageId: 'warnTodo', column: 4, line: 1 }],
    },
    {
      code: 'test.todo("foo", function () {})',
      errors: [{ messageId: 'warnTodo', column: 6, line: 1 }],
    },
    {
      code: 'describe.todo.each([])("foo", function () {})',
      errors: [{ messageId: 'warnTodo', column: 10, line: 1 }],
    },
    {
      code: 'it.todo.each([])("foo", function () {})',
      errors: [{ messageId: 'warnTodo', column: 4, line: 1 }],
    },
    {
      code: 'test.todo.each([])("foo", function () {})',
      errors: [{ messageId: 'warnTodo', column: 6, line: 1 }],
    },
    {
      code: 'describe.only.todo("foo", function () {})',
      errors: [{ messageId: 'warnTodo', column: 15, line: 1 }],
    },
    {
      code: 'it.only.todo("foo", function () {})',
      errors: [{ messageId: 'warnTodo', column: 9, line: 1 }],
    },
    {
      code: 'test.only.todo("foo", function () {})',
      errors: [{ messageId: 'warnTodo', column: 11, line: 1 }],
    },
  ],
})
