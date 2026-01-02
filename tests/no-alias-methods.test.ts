import rule from '../src/rules/no-alias-methods'
import { ruleTester } from './ruleTester'

ruleTester.run(rule.name, rule, {
  valid: [
    'expect(a).toHaveBeenCalled()',
    'expect(a).toHaveBeenCalledTimes()',
    'expect(a).toHaveBeenCalledWith()',
    'expect(a).toHaveBeenLastCalledWith()',
    'expect(a).toHaveBeenNthCalledWith()',
    'expect(a).toHaveReturned()',
    'expect(a).toHaveReturnedTimes()',
    'expect(a).toHaveReturnedWith()',
    'expect(a).toHaveLastReturnedWith()',
    'expect(a).toHaveNthReturnedWith()',
    'expect(a).toThrowError()',
    'expect(a).rejects;',
    'expect(a);',
  ],
  invalid: [
    {
      code: 'expect(a).toBeCalled()',
      output: 'expect(a).toHaveBeenCalled()',
      errors: [
        {
          messageId: 'noAliasMethods',
          data: {
            alias: 'toBeCalled',
            canonical: 'toHaveBeenCalled',
          },
          column: 11,
          line: 1,
        },
      ],
    },
    {
      code: 'expect(a).toBeCalledTimes()',
      output: 'expect(a).toHaveBeenCalledTimes()',
      errors: [
        {
          messageId: 'noAliasMethods',
          data: {
            alias: 'toBeCalledTimes',
            canonical: 'toHaveBeenCalledTimes',
          },
          column: 11,
          line: 1,
        },
      ],
    },
    {
      code: 'expect(a).not["toThrow"]()',
      output: "expect(a).not['toThrowError']()",
      errors: [
        {
          messageId: 'noAliasMethods',
          data: {
            alias: 'toThrow',
            canonical: 'toThrowError',
          },
          column: 15,
          line: 1,
        },
      ],
    },
  ],
})
