import rule, { RULE_NAME } from '../src/rules/no-conditional-expect'
import { ruleTester } from './ruleTester'

ruleTester.run(`${RULE_NAME}-logical conditions`, rule, {
  valid: [
    `it('foo', () => {
     process.env.FAIL && setNum(1);

     expect(num).toBe(2);
      });`,
    `
      function getValue() {
     let num = 2;

     process.env.FAIL && setNum(1);

     return num;
      }

      it('foo', () => {
     expect(getValue()).toBe(2);
      });
    `,
    `
    function getValue() {
      let num = 2;

      process.env.FAIL || setNum(1);

      return num;
    }

    it('foo', () => {
      expect(getValue()).toBe(2);
    });
     `,
    `function myFunc(str: string) {
        return str;
      }
      describe("myTest", () => {
        it("has expected assertions", () => {
          expect.assertions(1);
          if (myFunc) {
            expect(myFunc("5")).toStrictEqual(5);
          }
        })
      })
    `,
  ],
  invalid: [
    {
      code: ` it('foo', () => {
      something && expect(something).toHaveBeenCalled();
       })`,
      errors: [
        {
          messageId: 'noConditionalExpect',
        },
      ],
    },
    {
      code: ` it('foo', () => {
      a || (b && expect(something).toHaveBeenCalled());
       })`,
      errors: [
        {
          messageId: 'noConditionalExpect',
        },
      ],
    },
    {
      code: `
       it.each\`\`('foo', () => {
      something || expect(something).toHaveBeenCalled();
       })
     `,
      errors: [{ messageId: 'noConditionalExpect' }],
    },
    {
      code: `
       it.each()('foo', () => {
      something || expect(something).toHaveBeenCalled();
       })
     `,
      errors: [{ messageId: 'noConditionalExpect' }],
    },
    {
      code: `
       function getValue() {
      something || expect(something).toHaveBeenCalled();
       }

       it('foo', getValue);
     `,
      errors: [{ messageId: 'noConditionalExpect' }],
    },
    {
      code: `
        function getValue() {
          return 1;
        }

        describe('test', () => {
          test('with assertions', () => {
            expect.assertions(1);
            expect(getValue()).toStrictEqual(1);
          })

          test('without assertions', () => {
            if (getValue) {
              expect(getValue()).toStrictEqual(1);
            }
          })
        })
      `,
      errors: [{ messageId: 'noConditionalExpect' }],
    },
    {
      code: `
        function getValue() {
          return 1;
        }

        describe('test', () => {
          test('without assertions', () => {
            if (getValue) {
              expect(getValue()).toStrictEqual(1);
            }
          })
          test('with assertions', () => {
            expect.assertions(1);
            expect(getValue()).toStrictEqual(1);
          })
        })
      `,
      errors: [{ messageId: 'noConditionalExpect' }],
    },
  ],
})

ruleTester.run(`${RULE_NAME}-conditional conditions`, rule, {
  valid: [
    `
      it('foo', () => {
        const num = process.env.FAIL ? 1 : 2;

        expect(num).toBe(2);
      });
    `,
    `
      function getValue() {
        return process.env.FAIL ? 1 : 2
      }

      it('foo', () => {
        expect(getValue()).toBe(2);
      });
    `,
  ],
  invalid: [
    {
      code: `
       it('foo', () => {
      something ? expect(something).toHaveBeenCalled() : noop();
       })
     `,
      errors: [{ messageId: 'noConditionalExpect' }],
    },
    {
      code: `
       function getValue() {
      something ? expect(something).toHaveBeenCalled() : noop();
       }

       it('foo', getValue);
     `,
      errors: [{ messageId: 'noConditionalExpect' }],
    },
    {
      code: `
       it('foo', () => {
      something ? noop() : expect(something).toHaveBeenCalled();
       })
     `,
      errors: [{ messageId: 'noConditionalExpect' }],
    },
  ],
})
