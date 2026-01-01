import rule from '../src/rules/no-done-callback'
import { ruleTester } from './ruleTester'

ruleTester.run(rule.name, rule, {
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
    'test.for([])("something", ([a, b], { expect }) => {})',
    'it.concurrent("something", (context) => {})',
    'it.concurrent("something", ({ expect }) => {})',
    'test("something", async function () {})',
    'test("something", someArg)',
    'beforeEach(() => {})',
    'beforeAll(async () => {})',
    'afterAll(() => {})',
    'afterAll(async function () {})',
    'afterAll(async function () {}, 5)',
    'describe.concurrent("something", () => { it("something", ({ expect }) => { }) })',
    'describe.concurrent("something", () => { it("something", context => { }) })',
  ],
  invalid: [
    {
      code: 'test("something", (...args) => {args[0]();})',
      errors: [{ messageId: 'noDoneCallback', line: 1, column: 20 }],
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
                'test("something", () => {return new Promise(done => {done();})})',
            },
          ],
        },
      ],
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
                'test("something", () => {return new Promise(finished => {finished();})})',
            },
          ],
        },
      ],
    },
    {
      code: 'beforeAll(async done => {done();})',
      errors: [{ messageId: 'useAwaitInsteadOfCallback', line: 1, column: 17 }],
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
                'beforeEach(() => {return new Promise(done => {done();})});',
            },
          ],
        },
      ],
    },
    {
      code: 'test.each``("something", ({ a, b }, done) => { done(); })',
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
                'test.each``("something", () => {return new Promise(done => { done(); })})',
            },
          ],
        },
      ],
    },
    {
      code: 'it.each``("something", ({ a, b }, done) => { done(); })',
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
                'it.each``("something", () => {return new Promise(done => { done(); })})',
            },
          ],
        },
      ],
    },
  ],
})
