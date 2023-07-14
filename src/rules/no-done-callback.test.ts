import { describe, it } from 'vitest'
import { ruleTester } from '../utils/test'
import rule, { RULE_NAME } from './no-done-callback'

describe(RULE_NAME, () => {
  it(RULE_NAME, () => {
    ruleTester.run(RULE_NAME, rule, {
      valid: [
        'test("something", () => {})',
        'test("something", async () => {})',
        'test("something", function() {})',
        'test.each``("something", ({ a, b }) => {})',
        'test.each()("something", ({ a, b }) => {})',
        'it.each()("something", ({ a, b }) => {})',
        'it.each([])("something", (a, b) => {})',
        'it.each``("something", ({ a, b }) => {})',
        'it.each([])("something", (a, b) => { a(); b(); })',
        'it.each``("something", ({ a, b }) => { a(); b(); })',
        'test("something", async function () {})',
        'test("something", someArg)',
        'beforeEach(() => {})',
        'beforeAll(async () => {})',
        'afterAll(() => {})',
        'afterAll(async function () {})',
        'afterAll(async function () {}, 5)'
      ],
      invalid: [
        {
          code: 'test("something", (...args) => {args[0]();})',
          errors: [{ messageId: 'noDoneCallback', line: 1, column: 20 }]
        },
        {
          code: 'test("something", done => {done();})',
          errors: [
            {
              messageId: 'noDoneCallback',
              line: 1,
              column: 1,
              suggestions: [
                {
                  messageId: 'suggestWrappingInPromise',
                  data: { callback: 'done' },
                  output:
                    'test("something", () => {return new Promise(done => {done();})})'
                }
              ]
            }
          ]
        },
        {
          code: 'test("something", finished => {finished();})',
          errors: [
            {
              messageId: 'noDoneCallback',
              line: 1,
              column: 1,
              suggestions: [
                {
                  messageId: 'suggestWrappingInPromise',
                  data: { callback: 'finished' },
                  output:
                    'test("something", () => {return new Promise(finished => {finished();})})'
                }
              ]
            }
          ]
        },
        {
          code: 'beforeAll(async done => {done();})',
          errors: [
            { messageId: 'useAwaitInsteadOfCallback', line: 1, column: 17 }
          ]
        },
        {
          code: 'beforeEach((done) => {done();});',
          errors: [
            {
              messageId: 'noDoneCallback',
              line: 1,
              column: 1,
              suggestions: [
                {
                  messageId: 'suggestWrappingInPromise',
                  data: { callback: 'done' },
                  output:
                    'beforeEach(() => {return new Promise(done => {done();})});'
                }
              ]
            }
          ]
        },
        {
          code: 'test.each``("something", ({ a, b }, done) => { done(); })',
          errors: [
            {
              messageId: 'noDoneCallback',
              line: 1,
              column: 1
            }
          ]
        },
        {
          code: 'it.each``("something", ({ a, b }, done) => { done(); })',
          errors: [
            {
              messageId: 'noDoneCallback',
              line: 1,
              column: 1
            }
          ]
        }
      ]
    })
  })
})
