import rule, { RULE_NAME } from '../src/rules/consistent-each-for'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    // No configuration - all usages are valid
    {
      name: 'test.each without configuration',
      code: 'test.each([1, 2, 3])("test", (n) => { expect(n).toBeDefined() })',
    },
    {
      name: 'test.for without configuration',
      code: 'test.for([1, 2, 3])("test", ([n]) => { expect(n).toBeDefined() })',
    },
    {
      name: 'describe.each without configuration',
      code: 'describe.each([1, 2, 3])("suite", (n) => { test("test", () => {}) })',
    },

    // test.each with preference for 'each'
    {
      name: 'test.each when configured to prefer each',
      code: 'test.each([1, 2, 3])("test", (n) => { expect(n).toBeDefined() })',
      options: [{ test: 'each' }],
    },
    {
      name: 'test.skip.each when configured to prefer each',
      code: 'test.skip.each([1, 2, 3])("test", (n) => { expect(n).toBeDefined() })',
      options: [{ test: 'each' }],
    },
    {
      name: 'test.only.each when configured to prefer each',
      code: 'test.only.each([1, 2, 3])("test", (n) => { expect(n).toBeDefined() })',
      options: [{ test: 'each' }],
    },
    {
      name: 'test.concurrent.each when configured to prefer each',
      code: 'test.concurrent.each([1, 2, 3])("test", (n) => { expect(n).toBeDefined() })',
      options: [{ test: 'each' }],
    },

    // test.for with preference for 'for'
    {
      name: 'test.for when configured to prefer for',
      code: 'test.for([1, 2, 3])("test", ([n]) => { expect(n).toBeDefined() })',
      options: [{ test: 'for' }],
    },
    {
      name: 'test.skip.for when configured to prefer for',
      code: 'test.skip.for([1, 2, 3])("test", ([n]) => { expect(n).toBeDefined() })',
      options: [{ test: 'for' }],
    },
    {
      name: 'test.only.for when configured to prefer for',
      code: 'test.only.for([1, 2, 3])("test", ([n]) => { expect(n).toBeDefined() })',
      options: [{ test: 'for' }],
    },

    // it.each with preference for 'each'
    {
      name: 'it.each when configured to prefer each',
      code: 'it.each([1, 2, 3])("test", (n) => { expect(n).toBeDefined() })',
      options: [{ it: 'each' }],
    },

    // it.for with preference for 'for'
    {
      name: 'it.for when configured to prefer for',
      code: 'it.for([1, 2, 3])("test", ([n]) => { expect(n).toBeDefined() })',
      options: [{ it: 'for' }],
    },

    // describe.each with preference for 'each'
    {
      name: 'describe.each when configured to prefer each',
      code: 'describe.each([1, 2, 3])("suite", (n) => { test("test", () => {}) })',
      options: [{ describe: 'each' }],
    },
    {
      name: 'describe.skip.each when configured to prefer each',
      code: 'describe.skip.each([1, 2, 3])("suite", (n) => { test("test", () => {}) })',
      options: [{ describe: 'each' }],
    },

    // describe.for with preference for 'for'
    {
      name: 'describe.for when configured to prefer for',
      code: 'describe.for([1, 2, 3])("suite", ([n]) => { test("test", () => {}) })',
      options: [{ describe: 'for' }],
    },

    // suite.each with preference for 'each'
    {
      name: 'suite.each when configured to prefer each',
      code: 'suite.each([1, 2, 3])("suite", (n) => { test("test", () => {}) })',
      options: [{ suite: 'each' }],
    },

    // suite.for with preference for 'for'
    {
      name: 'suite.for when configured to prefer for',
      code: 'suite.for([1, 2, 3])("suite", ([n]) => { test("test", () => {}) })',
      options: [{ suite: 'for' }],
    },

    // Mixed configurations - test prefers 'each', describe prefers 'for'
    {
      name: 'mixed configuration respects individual settings',
      code: `
        test.each([1, 2, 3])("test", (n) => { expect(n).toBeDefined() })
        describe.for([1, 2, 3])("suite", ([n]) => { test("test", () => {}) })
      `,
      options: [{ test: 'each', describe: 'for' }],
    },
  ],
  invalid: [
    // test.for when configured to prefer 'each'
    {
      name: 'test.for when configured to prefer each',
      code: 'test.for([1, 2, 3])("test", ([n]) => { expect(n).toBeDefined() })',
      options: [{ test: 'each' }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: { functionName: 'test', preferred: 'each', actual: 'for' },
          column: 6,
          line: 1,
        },
      ],
    },
    {
      name: 'test.skip.for when configured to prefer each',
      code: 'test.skip.for([1, 2, 3])("test", ([n]) => { expect(n).toBeDefined() })',
      options: [{ test: 'each' }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: { functionName: 'test', preferred: 'each', actual: 'for' },
          column: 11,
          line: 1,
        },
      ],
    },
    {
      name: 'test.only.for when configured to prefer each',
      code: 'test.only.for([1, 2, 3])("test", ([n]) => { expect(n).toBeDefined() })',
      options: [{ test: 'each' }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: { functionName: 'test', preferred: 'each', actual: 'for' },
          column: 11,
          line: 1,
        },
      ],
    },

    // test.each when configured to prefer 'for'
    {
      name: 'test.each when configured to prefer for',
      code: 'test.each([1, 2, 3])("test", (n) => { expect(n).toBeDefined() })',
      options: [{ test: 'for' }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: { functionName: 'test', preferred: 'for', actual: 'each' },
          column: 6,
          line: 1,
        },
      ],
    },
    {
      name: 'test.skip.each when configured to prefer for',
      code: 'test.skip.each([1, 2, 3])("test", (n) => { expect(n).toBeDefined() })',
      options: [{ test: 'for' }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: { functionName: 'test', preferred: 'for', actual: 'each' },
          column: 11,
          line: 1,
        },
      ],
    },

    // it.for when configured to prefer 'each'
    {
      name: 'it.for when configured to prefer each',
      code: 'it.for([1, 2, 3])("test", ([n]) => { expect(n).toBeDefined() })',
      options: [{ it: 'each' }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: { functionName: 'it', preferred: 'each', actual: 'for' },
          column: 4,
          line: 1,
        },
      ],
    },

    // it.each when configured to prefer 'for'
    {
      name: 'it.each when configured to prefer for',
      code: 'it.each([1, 2, 3])("test", (n) => { expect(n).toBeDefined() })',
      options: [{ it: 'for' }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: { functionName: 'it', preferred: 'for', actual: 'each' },
          column: 4,
          line: 1,
        },
      ],
    },

    // describe.for when configured to prefer 'each'
    {
      name: 'describe.for when configured to prefer each',
      code: 'describe.for([1, 2, 3])("suite", ([n]) => { test("test", () => {}) })',
      options: [{ describe: 'each' }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: { functionName: 'describe', preferred: 'each', actual: 'for' },
          column: 10,
          line: 1,
        },
      ],
    },

    // describe.each when configured to prefer 'for'
    {
      name: 'describe.each when configured to prefer for',
      code: 'describe.each([1, 2, 3])("suite", (n) => { test("test", () => {}) })',
      options: [{ describe: 'for' }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: { functionName: 'describe', preferred: 'for', actual: 'each' },
          column: 10,
          line: 1,
        },
      ],
    },

    // suite.for when configured to prefer 'each'
    {
      name: 'suite.for when configured to prefer each',
      code: 'suite.for([1, 2, 3])("suite", ([n]) => { test("test", () => {}) })',
      options: [{ suite: 'each' }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: { functionName: 'suite', preferred: 'each', actual: 'for' },
          column: 7,
          line: 1,
        },
      ],
    },

    // suite.each when configured to prefer 'for'
    {
      name: 'suite.each when configured to prefer for',
      code: 'suite.each([1, 2, 3])("suite", (n) => { test("test", () => {}) })',
      options: [{ suite: 'for' }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: { functionName: 'suite', preferred: 'for', actual: 'each' },
          column: 7,
          line: 1,
        },
      ],
    },

    // Multiple violations in one file
    {
      name: 'multiple violations',
      code: `
        test.for([1, 2])("test1", ([n]) => {})
        test.for([3, 4])("test2", ([n]) => {})
      `,
      options: [{ test: 'each' }],
      errors: [
        {
          messageId: 'consistentMethod',
          data: { functionName: 'test', preferred: 'each', actual: 'for' },
          line: 2,
        },
        {
          messageId: 'consistentMethod',
          data: { functionName: 'test', preferred: 'each', actual: 'for' },
          line: 3,
        },
      ],
    },
  ],
})
