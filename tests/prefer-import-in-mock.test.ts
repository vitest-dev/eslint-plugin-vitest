import rule, { RULE_NAME } from '../src/rules/prefer-import-in-mock'
import { ruleTester } from './ruleTester'

describe(RULE_NAME, () => {
  ruleTester.run(RULE_NAME, rule, {
    valid: [
      'vi.mock(import("foo"))',
      'vi.mock(import("node:fs/promises"))',
      'vi.mock(import("./foo.js"), () => ({ Foo: vi.fn() }))',
      'vi.mock(import("./foo.js"), { spy: true });',
    ],
    invalid: [
      {
        options: [
          {
            fixable: false,
          },
        ],
        code: `vi.mock('foo', () => {})`,
        errors: [
          {
            messageId: 'preferImport',
          },
        ],
      },
      {
        options: [
          {
            fixable: false,
          },
        ],
        code: 'vi.mock("node:fs/promises")',
        errors: [{ messageId: 'preferImport', column: 1, line: 1 }],
      },
      {
        options: [
          {
            fixable: false,
          },
        ],
        code: 'vi.mock("./foo.js", () => ({ Foo: vi.fn() }))',
        errors: [{ messageId: 'preferImport', column: 1, line: 1 }],
      },
      {
        options: [
          {
            fixable: false,
          },
        ],
        code: `
        import { vi as renamedVi } from 'vitest';
        renamedVi.mock('./foo.js', () => ({ Foo: vi.fn() }))
      `,
        errors: [{ messageId: 'preferImport', column: 9, line: 3 }],
      },
    ],
  })

  ruleTester.run(RULE_NAME, rule, {
    valid: [
      'vi.mock(import("foo"))',
      'vi.mock(import("node:fs/promises"))',
      'vi.mock(import("./foo.js"), () => ({ Foo: vi.fn() }))',
      'vi.mock(import("./foo.js"), { spy: true });',
    ],
    invalid: [
      {
        code: `vi.mock('foo', () => {})`,
        errors: [
          {
            messageId: 'preferImport',
          },
        ],
        output: `vi.mock(import('foo'), () => {})`,
      },
      {
        code: 'vi.mock("node:fs/promises")',
        errors: [{ messageId: 'preferImport', column: 1, line: 1 }],
        output: "vi.mock(import('node:fs/promises'))",
      },
      {
        code: 'vi.mock("./foo.js", () => ({ Foo: vi.fn() }))',
        errors: [{ messageId: 'preferImport', column: 1, line: 1 }],
        output: "vi.mock(import('./foo.js'), () => ({ Foo: vi.fn() }))",
      },
      {
        code: `
        import { vi as renamedVi } from 'vitest';
        renamedVi.mock('./foo.js', () => ({ Foo: vi.fn() }))
      `,
        errors: [{ messageId: 'preferImport', column: 9, line: 3 }],
        output: `
        import { vi as renamedVi } from 'vitest';
        renamedVi.mock(import('./foo.js'), () => ({ Foo: vi.fn() }))
      `,
      },
    ],
  })
})
