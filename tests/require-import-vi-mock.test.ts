import rule, { RULE_NAME } from '../src/rules/require-import-vi-mock'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'vi.mock(import("./foo.js"))',
    'vi.mock(import("node:fs/promises"))',
    'vi.mock(import("./foo.js"), () => ({ Foo: vi.fn() }))',
    'vi.mock(import("./foo.js"), { spy: true });',
  ],
  invalid: [
    {
      code: 'vi.mock("./foo.js")',
      errors: [{ messageId: 'requireImport', column: 9, line: 1 }],
      output: "vi.mock(import('./foo.js'))",
    },
    {
      code: 'vi.mock("node:fs/promises")',
      errors: [{ messageId: 'requireImport', column: 9, line: 1 }],
      output: "vi.mock(import('node:fs/promises'))",
    },
    {
      code: 'vi.mock("./foo.js", () => ({ Foo: vi.fn() }))',
      errors: [{ messageId: 'requireImport', column: 9, line: 1 }],
      output: "vi.mock(import('./foo.js'), () => ({ Foo: vi.fn() }))",
    },
    {
      code: `
        import { vi as renamedVi } from 'vitest';

        renamedVi.mock('./foo.js', () => ({ Foo: vi.fn() }))
      `,
      errors: [{ messageId: 'requireImport', column: 24, line: 4 }],
      output: `
        import { vi as renamedVi } from 'vitest';

        renamedVi.mock(import('./foo.js'), () => ({ Foo: vi.fn() }))
      `,
    },
  ],
})
