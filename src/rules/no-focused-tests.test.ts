import { it } from 'vitest'
import { ruleTester } from '../utils/test'
import rule, { RULE_NAME } from './no-focused-tests'

it(RULE_NAME, () => {
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
        output: 'it.only("test", () => {});'
      },
      {
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
        output: 'describe.only("test", () => {});'
      },
      {
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
        output: 'test.only("test", () => {});'
      },
      {
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
        output: 'it.only.each([])("test", () => {});'
      }
    ]
  })
})
