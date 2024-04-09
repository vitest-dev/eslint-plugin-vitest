import rule, { RULE_NAME } from '../src/rules/require-local-test-context-for-concurrent-snapshots'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'it("something", () => { expect(true).toBe(true) })',
    'it.concurrent("something", () => { expect(true).toBe(true) })',
    'it("something", () => { expect(1).toMatchSnapshot() })',
    'it.concurrent("something", ({ expect }) => { expect(1).toMatchSnapshot() })',
    'it.concurrent("something", ({ expect }) => { expect(1).toMatchInlineSnapshot("1") })',
    'describe.concurrent("something", () => { it("something", () => { expect(true).toBe(true) }) })',
    'describe.concurrent("something", () => { it("something", ({ expect }) => { expect(1).toMatchSnapshot() }) })',
    'describe.concurrent("something", () => { it("something", ({ expect }) => { expect(1).toMatchInlineSnapshot() }) })',
    'describe("something", () => { it("something", ({ expect }) => { expect(1).toMatchInlineSnapshot() }) })',
    'describe("something", () => { it("something", (context) => { expect(1).toMatchInlineSnapshot() }) })',
    'describe("something", () => { it("something", (context) => { context.expect(1).toMatchInlineSnapshot() }) })',
    'describe("something", () => { it("something", (context) => { expect(1).toMatchInlineSnapshot() }) })',
    'it.concurrent("something", (context) => { context.expect(1).toMatchSnapshot() })'
  ],
  invalid: [
    {
      code: 'it.concurrent("should fail", () => { expect(true).toMatchSnapshot() })',
      errors: [{ messageId: 'requireLocalTestContext' }]
    },
    {
      code: 'it.concurrent("should fail", () => { expect(true).toMatchInlineSnapshot("true") })',
      errors: [{ messageId: 'requireLocalTestContext' }]
    },
    {
      code: 'describe.concurrent("failing", () => { it("should fail", () => { expect(true).toMatchSnapshot() }) })',
      errors: [{ messageId: 'requireLocalTestContext' }]
    },
    {
      code: 'describe.concurrent("failing", () => { it("should fail", () => { expect(true).toMatchInlineSnapshot("true") }) })',
      errors: [{ messageId: 'requireLocalTestContext' }]
    },
    {
      code: 'it.concurrent("something", (context) => { expect(true).toMatchSnapshot() })',
      errors: [{ messageId: 'requireLocalTestContext' }]
    },
    {
      code: `it.concurrent("something", () => {
                 expect(true).toMatchSnapshot();

                 expect(true).toMatchSnapshot();
            })`,
      errors: [{ messageId: 'requireLocalTestContext' }, { messageId: 'requireLocalTestContext' }]
    },
    {
      code: `it.concurrent("something", () => {
                 expect(true).toBe(true);

                 expect(true).toMatchSnapshot();
            })`,
      errors: [{ messageId: 'requireLocalTestContext' }]
    },
    {
      code: 'it.concurrent("should fail", () => { expect(true).toMatchFileSnapshot("./test/basic.output.html") })',
      errors: [{ messageId: 'requireLocalTestContext' }]
    },
    {
      code: 'it.concurrent("should fail", () => { expect(foo()).toThrowErrorMatchingSnapshot() })',
      errors: [{ messageId: 'requireLocalTestContext' }]
    },
    {
      code: 'it.concurrent("should fail", () => { expect(foo()).toThrowErrorMatchingInlineSnapshot("bar") })',
      errors: [{ messageId: 'requireLocalTestContext' }]
    }
  ]
})
