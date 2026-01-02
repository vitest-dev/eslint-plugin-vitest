import rule from '../src/rules/require-mock-type-parameters'
import { ruleTester } from './ruleTester'

const messageId = 'noTypeParameter'

ruleTester.run(rule.name, rule, {
  valid: [
    'vi.fn<(...args: any[]) => any>()',
    'vi.fn<(...args: string[]) => any>()',
    'vi.fn<(arg1: string) => string>()',
    'vi.fn<(arg1: any) => string>()',
    'vi.fn<(arg1: string) => void>()',
    'vi.fn<(arg1: string, arg2: boolean) => string>()',
    'vi.fn<(arg1: string, arg2: boolean, ...args: string[]) => string>()',
    'vi.fn<MyProcedure>()',
    'vi.fn<any>()',
    'vi.fn<(...args: any[]) => any>(() => {})',
    'vi.fn<() => string | undefined>().mockReturnValue("some error message");',
    'vi.importActual<{ default: boolean }>("./example.js")',
    'vi.importActual<MyModule>("./example.js")',
    'vi.importActual<any>("./example.js")',
    'vi.importMock<{ default: boolean }>("./example.js")',
    'vi.importMock<MyModule>("./example.js")',
    'vi.importMock<any>("./example.js")',
    'vi.importActual("./example.js")',
    'vi.importMock("./example.js")',
  ],
  invalid: [
    {
      code: 'vi.fn()',
      errors: [{ messageId, column: 4, line: 1 }],
    },
    {
      code: 'vi.fn(() => {})',
      errors: [{ messageId, column: 4, line: 1 }],
    },
    {
      code: 'vi.importActual("./example.js")',
      options: [{ checkImportFunctions: true }],
      errors: [{ messageId, column: 4, line: 1 }],
    },
    {
      code: 'vi.importMock("./example.js")',
      options: [{ checkImportFunctions: true }],
      errors: [{ messageId, column: 4, line: 1 }],
    },
  ],
})
