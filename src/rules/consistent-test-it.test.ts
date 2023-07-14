import { describe, it } from 'vitest'
import { TestCaseName } from '../utils/types'
import { ruleTester } from '../utils/test'
import rule, { RULE_NAME } from './consistent-test-it'

describe(RULE_NAME, () => {
  it(`${RULE_NAME} - fn=it`, () => {
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
          code: `	it('foo', () => {
						expect(true).toBe(false);
					});
					function myTest() { if ('bar') {} }`,
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
        }
      ]
    })
  })

  it(`${RULE_NAME} - fn=test`, () => {
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
  })

  it(`${RULE_NAME} - with fn=it and withinDescribe=it`, () => {
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
  })

  it(`${RULE_NAME} defaults without config object`, () => {
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
  })

  it(`${RULE_NAME} - with withinDescribe=it`, () => {
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
  })

  it(`${RULE_NAME} - with withinDescribe=test`, () => {
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
  })
})
