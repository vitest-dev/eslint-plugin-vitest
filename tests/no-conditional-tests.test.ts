import rule, { RULE_NAME } from '../src/rules/no-conditional-tests'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'test("shows error", () => {});',
    'it("foo", function () {})',
    "it('foo', () => {}); function myTest() { if ('bar') {} }",
    `function myFunc(str: string) {
    return str;
  }
  describe("myTest", () => {
     it("convert shortened equal filter", () => {
      expect(
      myFunc("5")
      ).toEqual("5");
     });
    });`,
    `describe("shows error", () => {
     if (1 === 2) {
      myFunc();
     }
     expect(true).toBe(false);
    });`,
  ],
  invalid: [
    {
      code: `describe("shows error", () => {
    if(true) {
     test("shows error", () => {
      expect(true).toBe(true);
     })
    }
   })`,
      errors: [{ messageId: 'noConditionalTests' }],
    },
    {
      code: `
   describe("shows error", () => {
    if(true) {
     it("shows error", () => {
      expect(true).toBe(true);
      })
     }
   })`,
      errors: [{ messageId: 'noConditionalTests' }],
    },
    {
      code: `describe("errors", () => {
    if (Math.random() > 0) {
     test("test2", () => {
     expect(true).toBeTruthy();
    });
    }
   });`,
      errors: [{ messageId: 'noConditionalTests' }],
    },
  ],
})
