import rule, { RULE_NAME } from '../src/rules//no-hooks'
import { HookName } from '../src/utils/types'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'test("foo")',
    'describe("foo", () => { it("bar") })',
    'test("foo", () => { expect(subject.beforeEach()).toBe(true) })',
    {
      code: 'afterEach(() => {}); afterAll(() => {});',
      options: [{ allow: [HookName.afterEach, HookName.afterAll] }],
    },
    { code: 'test("foo")', options: [{ allow: undefined }] },
  ],
  invalid: [
    {
      code: 'beforeAll(() => {})',
      errors: [
        {
          messageId: 'unexpectedHook',
          data: { hookName: HookName.beforeAll },
        },
      ],
    },
    {
      code: 'beforeEach(() => {})',
      errors: [
        {
          messageId: 'unexpectedHook',
          data: { hookName: HookName.beforeEach },
        },
      ],
    },
    {
      code: 'afterAll(() => {})',
      errors: [
        {
          messageId: 'unexpectedHook',
          data: { hookName: HookName.afterAll },
        },
      ],
    },
    {
      code: 'afterEach(() => {})',
      errors: [
        {
          messageId: 'unexpectedHook',
          data: { hookName: HookName.afterEach },
        },
      ],
    },
    {
      code: 'beforeEach(() => {}); afterEach(() => { vi.resetModules() });',
      options: [{ allow: [HookName.afterEach] }],
      errors: [
        {
          messageId: 'unexpectedHook',
          data: { hookName: HookName.beforeEach },
        },
      ],
    },
    {
      code: `
    import { beforeEach as afterEach, afterEach as beforeEach, vi } from 'vitest';
    afterEach(() => {});
    beforeEach(() => { vi.resetModules() });
    `,
      options: [{ allow: [HookName.afterEach] }],
      languageOptions: { parserOptions: { sourceType: 'module' } },
      errors: [
        {
          messageId: 'unexpectedHook',
          data: { hookName: HookName.beforeEach },
        },
      ],
    },
  ],
})
