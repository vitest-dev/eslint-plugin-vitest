import rule from '../src/rules/no-focused-tests'
import { ruleTester } from './ruleTester'

ruleTester.run(rule.name, rule, {
  valid: [
    'it("test", () => {});',
    'it.each([])("test", () => {});',
    'it.for([])("test", () => {});',

    'test("test", () => {});',
    'test("test", { only: false }, () => {});',
    'test.each([])("test", () => {});',
    'test.for([])("test", () => {});',

    'describe("test group", () => {});',
    'describe.each([])("test group", () => {});',
    'describe.for([])("test group", () => {});',
  ],
  invalid: [
    {
      options: [
        {
          fixable: false,
        },
      ],
      code: 'it.only("test", () => {});',
      errors: [
        {
          column: 4,
          endColumn: 8,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests',
        },
      ],
    },
    {
      options: [
        {
          fixable: false,
        },
      ],
      code: 'describe.only("test", () => {});',
      errors: [
        {
          column: 10,
          endColumn: 14,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests',
        },
      ],
    },
    {
      options: [
        {
          fixable: false,
        },
      ],
      code: 'test.only("test", () => {});',
      errors: [
        {
          column: 6,
          endColumn: 10,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests',
        },
      ],
    },
    {
      options: [
        {
          fixable: false,
        },
      ],
      code: 'it.only.each([])("test", () => {});',
      errors: [
        {
          column: 4,
          endColumn: 8,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests',
        },
      ],
    },
    {
      options: [
        {
          fixable: false,
        },
      ],
      code: 'test("test", { only: true }, () => {});',
      errors: [
        {
          column: 16,
          endColumn: 20,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests',
        },
      ],
    },
    {
      options: [
        {
          fixable: false,
        },
      ],
      code: 'it.only.for([])("test", () => {});',
      errors: [
        {
          column: 4,
          endColumn: 8,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests',
        },
      ],
    },
    {
      options: [
        {
          fixable: false,
        },
      ],
      code: 'describe.only.each([])("test", () => {});',
      errors: [
        {
          column: 10,
          endColumn: 14,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests',
        },
      ],
    },
    {
      options: [
        {
          fixable: false,
        },
      ],
      code: 'describe.only.for([])("test", () => {});',
      errors: [
        {
          column: 10,
          endColumn: 14,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests',
        },
      ],
    },
    {
      options: [
        {
          fixable: false,
        },
      ],
      code: 'test.only.each``("test", () => {});',
      errors: [
        {
          column: 6,
          endColumn: 10,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests',
        },
      ],
    },
    {
      options: [
        {
          fixable: false,
        },
      ],
      code: 'it.only.each``("test", () => {});',
      errors: [
        {
          column: 4,
          endColumn: 8,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests',
        },
      ],
    },
  ],
})

ruleTester.run(rule.name, rule, {
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
          messageId: 'noFocusedTests',
        },
      ],
      output: 'it("test", () => {});',
    },
    {
      code: 'describe.only("test", () => {});',
      errors: [
        {
          column: 10,
          endColumn: 14,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests',
        },
      ],
      output: 'describe("test", () => {});',
    },
    {
      code: 'test.only("test", () => {});',
      errors: [
        {
          column: 6,
          endColumn: 10,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests',
        },
      ],
      output: 'test("test", () => {});',
    },
    {
      code: 'test("test", { only: true }, () => {});',
      errors: [
        {
          column: 16,
          endColumn: 20,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests',
        },
      ],
      output: 'test("test", { only: false }, () => {});',
    },
    {
      code: 'it.only.each([])("test", () => {});',
      errors: [
        {
          column: 4,
          endColumn: 8,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests',
        },
      ],
      output: 'it.each([])("test", () => {});',
    },
    {
      code: 'it.only.for([])("test", () => {});',
      output: 'it.for([])("test", () => {});',
      errors: [
        {
          column: 4,
          endColumn: 8,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests',
        },
      ],
    },
    {
      code: 'describe.only.each([])("test", () => {});',
      output: 'describe.each([])("test", () => {});',
      errors: [
        {
          column: 10,
          endColumn: 14,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests',
        },
      ],
    },
    {
      code: 'describe.only.for([])("test", () => {});',
      output: 'describe.for([])("test", () => {});',
      errors: [
        {
          column: 10,
          endColumn: 14,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests',
        },
      ],
    },
    {
      code: 'test.only.each``("test", () => {});',
      errors: [
        {
          column: 6,
          endColumn: 10,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests',
        },
      ],
      output: 'test.each``("test", () => {});',
    },
    {
      code: 'it.only.each``("test", () => {});',
      errors: [
        {
          column: 4,
          endColumn: 8,
          endLine: 1,
          line: 1,
          messageId: 'noFocusedTests',
        },
      ],
      output: 'it.each``("test", () => {});',
    },
  ],
})
