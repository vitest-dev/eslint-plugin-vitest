import rule from '../src/rules/no-test-return-statement'
import { ruleTester } from './ruleTester'

ruleTester.run(rule.name, rule, {
  valid: [
    'it("noop", function () {});',
    'test("noop", () => {});',
    'test("one", () => expect(1).toBe(1));',
    'test("empty")',
    `it("one", myTest);
    function myTest() {
      expect(1).toBe(1);
    }`,
    `it("one", () => expect(1).toBe(1));
       function myHelper() {}`,
    'test("noop", { retry: 2 }, () => {});',
    'test("one", { retry: 2 }, () => expect(1).toBe(1));',
    'test("one", { retry: 2 }, myTest);',
  ],
  invalid: [
    {
      code: `test("one", () => {
      return expect(1).toBe(1);
       });`,
      errors: [
        {
          messageId: 'noTestReturnStatement',
          column: 7,
          line: 2,
        },
      ],
    },
    {
      code: `it("one", function () {
      return expect(1).toBe(1);
       });`,
      errors: [
        {
          messageId: 'noTestReturnStatement',
          column: 7,
          line: 2,
        },
      ],
    },
    {
      code: `it.skip("one", function () {
      return expect(1).toBe(1);
       });`,
      errors: [
        {
          messageId: 'noTestReturnStatement',
          column: 7,
          line: 2,
        },
      ],
    },
    {
      code: "test('returns', { retry: 2 }, () => { return Promise.resolve() })",
      errors: [
        {
          messageId: 'noTestReturnStatement',
          column: 39,
          line: 1,
        },
      ],
    },
    {
      code: `it("one", { timeout: 1000 }, function () {
      return expect(1).toBe(1);
       });`,
      errors: [
        {
          messageId: 'noTestReturnStatement',
          column: 7,
          line: 2,
        },
      ],
    },
    {
      code: `it("one", myTest);
     function myTest () {
       return expect(1).toBe(1);
     }`,
      errors: [
        {
          messageId: 'noTestReturnStatement',
          column: 8,
          line: 3,
        },
      ],
    },
  ],
})
