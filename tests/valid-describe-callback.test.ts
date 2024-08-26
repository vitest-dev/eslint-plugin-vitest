import rule, { RULE_NAME } from '../src/rules/valid-describe-callback'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'describe.each([1, 2, 3])("%s", (a, b) => {});',
    'describe("foo", function() {})',
    'describe("foo", () => {})',
    'describe(`foo`, () => {})',
    'xdescribe("foo", () => {})',
    'fdescribe("foo", () => {})',
    'describe.only("foo", () => {})',
    'describe.skip("foo", () => {})',
    'describe.todo("runPrettierFormat");',
    `
      describe('foo', () => {
        it('bar', () => {
          return Promise.resolve(42).then(value => {
            expect(value).toBe(42)
          })
        })
      })
    `,
    `
      describe('foo', () => {
        it('bar', async () => {
          expect(await Promise.resolve(42)).toBe(42)
        })
      })
    `,
    `
      if (hasOwnProperty(obj, key)) {
      }
    `,
    `
      describe.each\`
        foo  | foe
        ${1} | ${2}
      \`('$something', ({ foo, foe }) => {});
    `,
    // https://github.com/vitest-dev/eslint-plugin-vitest/issues/511
    'describe("foo", async () => {})',
    'describe("foo", async function () {})',
    'xdescribe("foo", async function () {})',
    'fdescribe("foo", async function () {})',
    'describe.only("foo", async function () {})',
    'describe.skip("foo", async function () {})',
    `describe('sample case', () => {
        it('works', () => {
          expect(true).toEqual(true);
        });
        describe('async', () => {
          it('works', async () => {
            await new Promise(setImmediate);
            expect(true).toEqual(true);
          });
        });
      });
    `
  ],
  invalid: [
    {
      code: 'describe.each()()',
      errors: [{ messageId: 'nameAndCallback', line: 1, column: 1 }]
    },
    {
      code: 'describe["each"]()()',
      errors: [{ messageId: 'nameAndCallback', line: 1, column: 1 }]
    },
    {
      code: 'describe.each(() => {})()',
      errors: [{ messageId: 'nameAndCallback', line: 1, column: 1 }]
    },
    {
      code: 'describe.each(() => {})("foo")',
      errors: [{ messageId: 'nameAndCallback', line: 1, column: 25 }]
    },
    {
      code: 'describe.each()(() => {})',
      errors: [{ messageId: 'nameAndCallback', line: 1, column: 17 }]
    },
    {
      code: 'describe["each"]()(() => {})',
      errors: [{ messageId: 'nameAndCallback', line: 1, column: 20 }]
    },
    {
      code: 'describe.each("foo")(() => {})',
      errors: [{ messageId: 'nameAndCallback', line: 1, column: 22 }]
    },
    {
      code: 'describe.only.each("foo")(() => {})',
      errors: [{ messageId: 'nameAndCallback', line: 1, column: 27 }]
    },
    {
      code: 'describe(() => {})',
      errors: [{ messageId: 'nameAndCallback', line: 1, column: 10 }]
    },
    {
      code: 'describe("foo")',
      errors: [{ messageId: 'nameAndCallback', line: 1, column: 10 }]
    },
    {
      code: 'describe("foo", "foo2")',
      errors: [
        { messageId: 'secondArgumentMustBeFunction', line: 1, column: 10 }
      ]
    },
    {
      code: 'describe()',
      errors: [{ messageId: 'nameAndCallback', line: 1, column: 1 }]
    },
    {
      code: `
       describe('foo', function () {
      return Promise.resolve().then(() => {
        it('breaks', () => {
       throw new Error('Fail')
        })
      })
       })
     `,
      errors: [{ messageId: 'unexpectedReturnInDescribe', line: 3, column: 7 }]
    },
    {
      code: `
       describe('foo', () => {
      return Promise.resolve().then(() => {
        it('breaks', () => {
       throw new Error('Fail')
        })
      })
      describe('nested', () => {
        return Promise.resolve().then(() => {
       it('breaks', () => {
         throw new Error('Fail')
       })
        })
      })
       })
     `,
      errors: [
        { messageId: 'unexpectedReturnInDescribe', line: 3, column: 7 },
        { messageId: 'unexpectedReturnInDescribe', line: 9, column: 9 }
      ]
    },
    {
      code: `
       describe('foo', async () => {
      await something()
      it('does something')
      describe('nested', () => {
        return Promise.resolve().then(() => {
       it('breaks', () => {
         throw new Error('Fail')
       })
        })
      })
       })
     `,
      errors: [
        { messageId: 'unexpectedReturnInDescribe', line: 6, column: 9 }
      ]
    },
    {
      code: `
       describe('foo', () =>
      test('bar', () => {})
       )
     `,
      errors: [
        { messageId: 'unexpectedReturnInDescribe', line: 2, column: 24 }
      ]
    },
    {
      code: 'describe("foo", done => {})',
      errors: [
        { messageId: 'unexpectedDescribeArgument', line: 1, column: 17 }
      ]
    },
    {
      code: 'describe("foo", function (done) {})',
      errors: [
        { messageId: 'unexpectedDescribeArgument', line: 1, column: 17 }
      ]
    },
    {
      code: 'describe("foo", function (one, two, three) {})',
      errors: [
        { messageId: 'unexpectedDescribeArgument', line: 1, column: 17 }
      ]
    },
    {
      code: 'describe("foo", async function (done) {})',
      errors: [
        { messageId: 'unexpectedDescribeArgument', line: 1, column: 17 }
      ]
    }
  ]
})
