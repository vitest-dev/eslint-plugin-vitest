import rule from '../src/rules/no-conditional-in-test'
import { ruleTester } from './ruleTester'

ruleTester.run(`${rule.name}-conditional expressions`, rule, {
  valid: [
    'const x = y ? 1 : 0',
    `const foo = function (bar) {
     return foo ? bar : null;
      };
      it('foo', () => {
     foo();
      });`,
    `it.concurrent('foo', () => {
     switch('bar') {}
      })`,
  ],
  invalid: [
    {
      code: `it('foo', function () {
      if('bar') {}
     });`,
      errors: [
        {
          messageId: 'noConditionalInTest',
        },
      ],
    },
  ],
})

ruleTester.run(`${rule.name}-if statements`, rule, {
  valid: [
    'if (foo) {}',
    "it('foo', () => {})",
    'it("foo", function () {})',
    "it('foo', () => {}); function myTest() { if ('bar') {} }",
    `describe.each\`\`('foo', () => {
     afterEach(() => {
       if ('bar') {}
     });
      })`,
    `const values = something.map((thing) => {
     if (thing.isFoo) {
       return thing.foo
     } else {
       return thing.bar;
     }
      });
   
      describe('valid', () => {
     it('still valid', () => {
       expect(values).toStrictEqual(['foo']);
     });
      });`,
  ],
  invalid: [
    {
      code: ` describe('foo', () => {
      it('bar', () => {
        if ('bar') {}
      })
      it('baz', () => {
        if ('qux') {}
        if ('quux') {}
      })
       })`,
      errors: [
        { messageId: 'noConditionalInTest', column: 9, line: 3 },
        { messageId: 'noConditionalInTest', column: 9, line: 6 },
        { messageId: 'noConditionalInTest', column: 9, line: 7 },
      ],
    },
    {
      code: `test("shows error", () => {
      if (1 === 2) {
        expect(true).toBe(false);
      }
       });
     
       test("does not show error", () => {
      setTimeout(() => console.log("noop"));
      if (1 === 2) {
        expect(true).toBe(false);
      }
       });`,
      errors: [
        { messageId: 'noConditionalInTest', column: 7, line: 2 },
        { messageId: 'noConditionalInTest', column: 7, line: 9 },
      ],
    },
  ],
})
