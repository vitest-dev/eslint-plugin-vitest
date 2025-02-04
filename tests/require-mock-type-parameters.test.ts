import rule, { RULE_NAME } from '../src/rules/require-mock-type-parameters'
import { ruleTester } from './ruleTester'

const messageId = 'noTypeParameter'

ruleTester.run(RULE_NAME, rule, {
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
    'vi.fn<(...args: any[]) => any>(() => {})'
  ],
  invalid: [
    {
      code: 'vi.fn();',
      errors: [{ messageId, column: 4, line: 1 }]
    },
    {
      code: 'vi.fn(() => {});',
      errors: [{ messageId, column: 4, line: 1 }]
    }
  ]
})
