import rule, { RULE_NAME } from '../src/rules/require-test-timeout'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'test.todo("a")',
    'xit("a", () => {})',
    'test("a", () => {}, 0)',
    'it("a", () => {}, 500)',
    'it.skip("a", () => {})',
    'test.skip("a", () => {})',
    'test("a", () => {}, 1000)',
    'it.only("a", () => {}, 1234)',
    'test.only("a", () => {}, 1234)',
    'it.concurrent("a", () => {}, 400)',
    'test("a", () => {}, { timeout: 0 })',
    'test.concurrent("a", () => {}, 400)',
    'test("a", () => {}, { timeout: 500 })',
    'test("a", { timeout: 500 }, () => {})',
    'vi.setConfig({ testTimeout: 1000 }); test("a", () => {})',
    // multiple object args where one contains timeout
    'test("a", { foo: 1 }, { timeout: 500 }, () => {})',
    // both object and numeric timeout present
    'test("a", { timeout: 500 }, 1000, () => {})',
    'test("a", () => {}, 1000, { extra: true })',
  ],
  invalid: [
    {
      code: 'test("a", () => {})',
      errors: [{ messageId: 'missingTimeout' }],
    },
    {
      code: 'it("a", () => {})',
      errors: [{ messageId: 'missingTimeout' }],
    },
    {
      code: 'test.only("a", () => {})',
      errors: [{ messageId: 'missingTimeout' }],
    },
    {
      code: 'test.concurrent("a", () => {})',
      errors: [{ messageId: 'missingTimeout' }],
    },
    {
      code: 'it.concurrent("a", () => {})',
      errors: [{ messageId: 'missingTimeout' }],
    },
    {
      code: 'vi.setConfig({}); test("a", () => {})',
      errors: [{ messageId: 'missingTimeout' }],
    },
    {
      code: 'const t = 500; test("a", { timeout: t }, () => {})',
      errors: [{ messageId: 'missingTimeout' }],
    },
    // null/undefined/identifier/negative cases
    {
      code: 'test("a", () => {}, { timeout: null })',
      errors: [{ messageId: 'missingTimeout' }],
    },
    {
      code: 'test("a", () => {}, { timeout: undefined })',
      errors: [{ messageId: 'missingTimeout' }],
    },
    {
      code: 'test("a", () => {}, -100)',
      errors: [{ messageId: 'missingTimeout' }],
    },
    {
      code: 'test("a", () => {}, { timeout: -1 })',
      errors: [{ messageId: 'missingTimeout' }],
    },
    {
      code: 'vi.setConfig({ testTimeout: null }); test("a", () => {})',
      errors: [{ messageId: 'missingTimeout' }],
    },
    {
      code: 'vi.setConfig({ testTimeout: undefined }); test("a", () => {})',
      errors: [{ messageId: 'missingTimeout' }],
    },
    {
      // setConfig after test should NOT exempt the earlier test
      code: 'test("a", () => {}); vi.setConfig({ testTimeout: 1000 })',
      errors: [{ messageId: 'missingTimeout' }],
    },
    // spread/complex object cases (spread should not be treated as literal timeout)
    {
      code: 'const opts = { timeout: 1000 }; test("a", { ...opts }, () => {})',
      errors: [{ messageId: 'missingTimeout' }],
    },
    {
      code: 'const opts = { timeout: 1000 }; test("a", { ...opts }, { foo: 1 }, () => {})',
      errors: [{ messageId: 'missingTimeout' }],
    },
    // mixed valid/invalid timeout specs: any explicit invalid timeout should fail
    {
      code: 'test("a", () => {}, { timeout: -1 }, { timeout: 500 })',
      errors: [{ messageId: 'missingTimeout' }],
    },
    {
      code: 'test("a", () => {}, { timeout: 500 }, { timeout: -1 })',
      errors: [{ messageId: 'missingTimeout' }],
    },
    {
      code: 'test("a", () => {}, { timeout: -1 }, 1000)',
      errors: [{ messageId: 'missingTimeout' }],
    },
    {
      code: 'test("a", () => {}, 1000, { timeout: -1 })',
      errors: [{ messageId: 'missingTimeout' }],
    },
  ],
})
