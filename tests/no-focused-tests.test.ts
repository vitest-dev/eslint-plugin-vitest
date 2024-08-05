import rule, { RULE_NAME } from '../src/rules/no-focused-tests'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: ['it("test", () => {});', 'describe("test group", () => {});'],
  invalid: [
    {
      code: 'it.only("test", () => {});',
      errors: [
        {
          column: 4,
          endColumn: 8,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests'
        }
      ],
    },
    {
      options: [{
        fixable: false
      }],
      code: 'describe.only("test", () => {});',
      errors: [
        {
          column: 10,
          endColumn: 14,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests'
        }
      ],
    },
    {
      options: [{
        fixable: false
      }],
      code: 'test.only("test", () => {});',
      errors: [
        {
          column: 6,
          endColumn: 10,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests'
        }
      ],
    },
    {
      options: [{
        fixable: false
      }],
      code: 'it.only.each([])("test", () => {});',
      errors: [
        {
          column: 4,
          endColumn: 8,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests'
        }
      ],
    },
    {
      options: [{
        fixable: false
      }],
      code: 'test.only.each``("test", () => {});',
      errors: [
        {
          column: 6,
          endColumn: 10,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests'
        }
      ],
    },
    {
      options: [{
        fixable: false
      }],
      code: 'it.only.each``("test", () => {});',
      errors: [
        {
          column: 4,
          endColumn: 8,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests'
        }
      ],
    }
  ]
})

ruleTester.run(RULE_NAME, rule, {
  valid: ['it("test", () => {});', 'describe("test group", () => {});'],
  invalid: [
    {
      options: [{
        fixable: true
      }],
      code: 'it.only("test", () => {});',
      errors: [
        {
          column: 4,
          endColumn: 8,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests'
        }
      ],
      output: 'it("test", () => {});'
    },
    {
      options: [{
        fixable: true
      }],
      code: 'describe.only("test", () => {});',
      errors: [
        {
          column: 10,
          endColumn: 14,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests'
        }
      ],
      output: 'describe("test", () => {});'
    },
    {
      options: [{
        fixable: true
      }],
      code: 'test.only("test", () => {});',
      errors: [
        {
          column: 6,
          endColumn: 10,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests'
        }
      ],
      output: 'test("test", () => {});'
    },
    {
      options: [{
        fixable: true
      }],
      code: 'it.only.each([])("test", () => {});',
      errors: [
        {
          column: 4,
          endColumn: 8,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests'
        }
      ],
      output: 'it.each([])("test", () => {});'
    },
    {
      options: [{
        fixable: true
      }],
      code: 'test.only.each``("test", () => {});',
      errors: [
        {
          column: 6,
          endColumn: 10,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests'
        }
      ],
      output: 'test.each``("test", () => {});'
    },
    {
      options: [{
        fixable: true
      }],
      code: 'it.only.each``("test", () => {});',
      errors: [
        {
          column: 4,
          endColumn: 8,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests'
        }
      ],
      output: 'it.each``("test", () => {});'
    }
  ]
})
