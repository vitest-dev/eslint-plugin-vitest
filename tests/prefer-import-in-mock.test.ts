import rule from '../src/rules/prefer-import-in-mock'
import { ruleTester } from './ruleTester'

describe(rule.name, () => {
  ruleTester.run(rule.name, rule, {
    valid: [
      'vi.mock(import("foo"))',
      'vi.mock(import("node:fs/promises"))',
      'vi.mock(import("./foo.js"), () => ({ Foo: vi.fn() }))',
      'vi.mock(import("./foo.js"), { spy: true });',
      'vi.doMock(import("foo"))',
      'vi.doMock(import("node:fs/promises"))',
      'vi.doMock(import("./foo.js"), () => ({ Foo: vi.fn() }))',
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
        code: `vi.doMock('foo', () => {})`,
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
        code: 'vi.doMock("node:fs/promises")',
        errors: [{ messageId: 'preferImport', column: 1, line: 1 }],
      },
      {
        options: [
          {
            fixable: false,
          },
        ],
        code: 'vi.doMock("./foo.js", () => ({ Foo: vi.fn() }))',
        errors: [{ messageId: 'preferImport', column: 1, line: 1 }],
      },
    ],
  })

  ruleTester.run(rule.name, rule, {
    valid: [
      'vi.mock(import("foo"))',
      'vi.mock(import("node:fs/promises"))',
      'vi.mock(import("./foo.js"), () => ({ Foo: vi.fn() }))',
      'vi.mock(import("./foo.js"), { spy: true });',
      'vi.doMock(import("foo"))',
      'vi.doMock(import("node:fs/promises"))',
      'vi.doMock(import("./foo.js"), () => ({ Foo: vi.fn() }))',
      // Vitest does not transform aliased calls, so `import()` would fail at runtime
      `
        import { vi as renamedVi } from 'vitest';
        renamedVi.mock('./foo.js', () => ({ Foo: vi.fn() }))
      `,
      `
        import { vi as renamedVi } from 'vitest';
        renamedVi.doMock('./foo.js', () => ({ Foo: vi.fn() }))
      `,
      'vi.mock(1)',
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
        output: 'vi.mock(import("node:fs/promises"))',
      },
      {
        code: 'vi.mock("./foo.js", () => ({ Foo: vi.fn() }))',
        errors: [{ messageId: 'preferImport', column: 1, line: 1 }],
        output: 'vi.mock(import("./foo.js"), () => ({ Foo: vi.fn() }))',
      },
      {
        code: `
        import { vi } from 'vitest';
        vi.mock('./foo.js', () => ({ Foo: vi.fn() }))
      `,
        errors: [{ messageId: 'preferImport', column: 9, line: 3 }],
        output: `
        import { vi } from 'vitest';
        vi.mock(import('./foo.js'), () => ({ Foo: vi.fn() }))
      `,
      },
      {
        code: `vitest.mock('foo')`,
        errors: [{ messageId: 'preferImport', column: 1, line: 1 }],
        output: `vitest.mock(import('foo'))`,
      },
      {
        code: `vi.doMock("./it's.js", () => ({}))`,
        errors: [{ messageId: 'preferImport', column: 1, line: 1 }],
        output: `vi.doMock(import("./it's.js"), () => ({}))`,
      },
      {
        code: String.raw`vi.mock('./it\'s.js')`,
        errors: [{ messageId: 'preferImport', column: 1, line: 1 }],
        output: String.raw`vi.mock(import('./it\'s.js'))`,
      },
      {
        code: `vi.doMock('foo', () => {})`,
        errors: [
          {
            messageId: 'preferImport',
          },
        ],
        output: `vi.doMock(import('foo'), () => {})`,
      },
      {
        code: 'vi.doMock("node:fs/promises")',
        errors: [{ messageId: 'preferImport', column: 1, line: 1 }],
        output: 'vi.doMock(import("node:fs/promises"))',
      },
      {
        code: 'vi.doMock("./foo.js", () => ({ Foo: vi.fn() }))',
        errors: [{ messageId: 'preferImport', column: 1, line: 1 }],
        output: 'vi.doMock(import("./foo.js"), () => ({ Foo: vi.fn() }))',
      },
    ],
  })
})
