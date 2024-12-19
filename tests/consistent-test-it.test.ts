import rule, { RULE_NAME } from '../src/rules/consistent-test-it'
import { TestCaseName } from '../src/utils/types'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      code: `it("shows error", () => {
  expect(true).toBe(false);
        });`,
      options: [{ fn: TestCaseName.it }]
    },
    {
      code: `it("foo", function () {
         expect(true).toBe(false);
     })`,
      options: [{ fn: TestCaseName.it }]
    },
    {
      code: ` it('foo', () => {
      expect(true).toBe(false);
  });
  function myTest() { if ('bar') {} }`,
      options: [{ fn: TestCaseName.it }]
    },
    {
      code: `bench("foo", function () {
        fibonacci(10);
     })`,
      options: [{ fn: TestCaseName.it }]
    }
  ],
  invalid: [
    {
      code: 'test("shows error", () => {});',
      options: [{ fn: TestCaseName.it }],
      output: 'it("shows error", () => {});',
      errors: [{ messageId: 'consistentMethod' }]
    },
    {
      code: 'test.skip("shows error");',
      output: 'it.skip("shows error");',
      options: [{ fn: TestCaseName.it }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: {
            testFnKeyWork: TestCaseName.it,
            oppositeTestKeyword: TestCaseName.test
          }
        }
      ]
    },
    {
      code: 'test.only(\'shows error\');',
      output: 'it.only(\'shows error\');',
      options: [{ fn: TestCaseName.it }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: {
            testFnKeyWork: TestCaseName.it,
            oppositeTestKeyword: TestCaseName.test
          }
        }
      ]
    },
    {
      code: 'describe(\'foo\', () => { it(\'bar\', () => {}); });',
      output: 'describe(\'foo\', () => { test(\'bar\', () => {}); });',
      options: [{ fn: TestCaseName.it, withinDescribe: TestCaseName.test }],
      errors: [
        {
          messageId: 'consistentMethodWithinDescribe',
          data: {
            testKeywordWithinDescribe: TestCaseName.test,
            oppositeTestKeyword: TestCaseName.it
          }
        }
      ]
    },
    {
      code: 'import { test } from "vitest"\ntest("shows error", () => {});',
      options: [{ fn: TestCaseName.it }],
      output: 'import { it } from "vitest"\nit("shows error", () => {});',
      errors: [{ messageId: 'consistentMethod' }, { messageId: 'consistentMethod' }]
    }
  ]
})

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      code: `test("shows error", () => {
      expect(true).toBe(false);
     });`,
      options: [{ fn: TestCaseName.test }]
    },
    {
      code: 'test.skip("foo")',
      options: [{ fn: TestCaseName.test }]
    },
    {
      code: 'test.concurrent("foo")',
      options: [{ fn: TestCaseName.test }]
    },
    {
      code: 'xtest("foo")',
      options: [{ fn: TestCaseName.test }]
    },
    {
      code: 'test.each([])("foo")',
      options: [{ fn: TestCaseName.test }]
    },
    {
      code: 'test.each``("foo")',
      options: [{ fn: TestCaseName.test }]
    },
    {
      code: 'describe("suite", () => { test("foo") })',
      options: [{ fn: TestCaseName.test }]
    }
  ],
  invalid: [
    {
      code: 'it("shows error", () => {});',
      options: [{ fn: TestCaseName.test }],
      output: 'test("shows error", () => {});',
      errors: [{ messageId: 'consistentMethod' }]
    },
    {
      code: 'describe("suite", () => { it("foo") })',
      output: 'describe("suite", () => { test("foo") })',
      options: [{ fn: TestCaseName.test }],
      errors: [
        {
          messageId: 'consistentMethodWithinDescribe',
          data: {
            testKeywordWithinDescribe: TestCaseName.test,
            oppositeTestKeyword: TestCaseName.it
          }
        }
      ]
    }
  ]
})

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      code: 'describe("suite", () => { it("foo") })',
      options: [{ fn: TestCaseName.it, withinDescribe: TestCaseName.it }]
    },
    {
      code: 'it("foo")',
      options: [{ fn: TestCaseName.it, withinDescribe: TestCaseName.it }]
    }
  ],
  invalid: [
    {
      code: 'describe("suite", () => { test("foo") })',
      output: 'describe("suite", () => { it("foo") })',
      options: [{ fn: TestCaseName.it, withinDescribe: TestCaseName.it }],
      errors: [
        {
          messageId: 'consistentMethodWithinDescribe',
          data: {
            testKeywordWithinDescribe: TestCaseName.it,
            oppositeTestKeyword: TestCaseName.test
          }
        }
      ]
    },
    {
      code: 'test("foo")',
      output: 'it("foo")',
      options: [{ fn: TestCaseName.it, withinDescribe: TestCaseName.it }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: {
            testFnKeyWork: TestCaseName.it,
            oppositeTestKeyword: TestCaseName.test
          }
        }
      ]
    }
  ]
})

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      code: 'test("shows error", () => {});'
    }
  ],
  invalid: [
    {
      code: 'describe("suite", () => { test("foo") })',
      output: 'describe("suite", () => { it("foo") })',
      errors: [
        {
          messageId: 'consistentMethodWithinDescribe',
          data: {
            testKeywordWithinDescribe: TestCaseName.it,
            oppositeTestKeyword: TestCaseName.test
          }
        }
      ]
    }
  ]
})

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      code: 'test("foo")',
      options: [{ withinDescribe: TestCaseName.it }]
    },
    {
      code: 'describe("suite", () => { it("foo") })',
      options: [{ withinDescribe: TestCaseName.it }]
    }
  ],
  invalid: [
    {
      code: 'it("foo")',
      output: 'test("foo")',
      options: [{ withinDescribe: TestCaseName.it }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: {
            testFnKeyWork: TestCaseName.test,
            oppositeTestKeyword: TestCaseName.it
          }
        }
      ]
    },
    {
      code: 'describe("suite", () => { test("foo") })',
      output: 'describe("suite", () => { it("foo") })',
      options: [{ withinDescribe: TestCaseName.it }],
      errors: [
        {
          messageId: 'consistentMethodWithinDescribe',
          data: {
            testKeywordWithinDescribe: TestCaseName.it,
            oppositeTestKeyword: TestCaseName.test
          }
        }
      ]
    }
  ]
})

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      code: 'test("foo")',
      options: [{ withinDescribe: TestCaseName.test }]
    },
    {
      code: 'describe("suite", () => { test("foo") })',
      options: [{ withinDescribe: TestCaseName.test }]
    }
  ],
  invalid: [
    {
      code: 'it("foo")',
      output: 'test("foo")',
      options: [{ withinDescribe: TestCaseName.test }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: {
            testFnKeyWork: TestCaseName.test,
            oppositeTestKeyword: TestCaseName.it
          }
        }
      ]
    },
    {
      code: 'import { it } from "vitest"\nit("foo")',
      output: 'import { test } from "vitest"\ntest("foo")',
      options: [
        { withinDescribe: TestCaseName.test }
      ],
      errors: [
        {
          messageId: 'consistentMethod',
          data: {
            testFnKeyWork: TestCaseName.test,
            oppositeTestKeyword: TestCaseName.it
          }
        },
        {
          messageId: 'consistentMethod',
          data: {
            testFnKeyWork: TestCaseName.test,
            oppositeTestKeyword: TestCaseName.it
          }
        }
      ]
    },
    {
      code: 'describe("suite", () => { it("foo") })',
      output: 'describe("suite", () => { test("foo") })',
      options: [{ withinDescribe: TestCaseName.test }],
      errors: [
        {
          messageId: 'consistentMethodWithinDescribe',
          data: {
            testKeywordWithinDescribe: TestCaseName.test,
            oppositeTestKeyword: TestCaseName.it
          }
        }
      ]
    }
  ]
})
