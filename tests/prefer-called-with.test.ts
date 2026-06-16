import rule from '../src/rules/prefer-called-with'
import { ruleTester } from './ruleTester'

ruleTester.run(rule.name, rule, {
  valid: [
    'expect(fn).toBeCalledWith();',
    'expect(fn).toHaveBeenCalledWith();',
    'expect(fn).toBeCalledWith(expect.anything());',
    'expect(fn).toHaveBeenCalledWith(expect.anything());',
    'expect(fn).not.toBeCalled();',
    'expect(fn).rejects.not.toBeCalled();',
    'expect(fn).not.toHaveBeenCalled();',
    'expect(fn).not.toBeCalledWith();',
    'expect(fn).not.toHaveBeenCalledWith();',
    'expect(fn).resolves.not.toHaveBeenCalledWith();',
    'expect(fn).toBeCalledTimes(0);',
    'expect(fn).toHaveBeenCalledTimes(0);',
    'expect(fn);',
    'expect(fn).toHaveBeenCalledExactlyOnceWith()',
  ],
  invalid: [
    {
      code: 'expect(fn).toBeCalled();',
      errors: [
        {
          messageId: 'preferCalledWith',
          data: { matcherName: 'toBeCalledWith' },
          column: 12,
          line: 1,
        },
      ],
      output: 'expect(fn).toBeCalledWith();',
    },
    {
      code: 'expect(fn).resolves.toBeCalled();',
      errors: [
        {
          messageId: 'preferCalledWith',
          data: { matcherName: 'toBeCalledWith' },
          column: 21,
          line: 1,
        },
      ],
      output: 'expect(fn).resolves.toBeCalledWith();',
    },
    {
      code: 'expect(fn).toHaveBeenCalled();',
      errors: [
        {
          messageId: 'preferCalledWith',
          data: { matcherName: 'toHaveBeenCalledWith' },
          column: 12,
          line: 1,
        },
      ],
      output: 'expect(fn).toHaveBeenCalledWith();',
    },
    {
      code: 'it("some test", () => {expect(mockApi).toHaveBeenCalledOnce();});',
      errors: [
        {
          messageId: 'preferCalledWith',
          data: { matcherName: 'toHaveBeenCalledExactlyOnceWith' },
          column: 40,
          line: 1,
        },
      ],
      output:
        'it("some test", () => {expect(mockApi).toHaveBeenCalledExactlyOnceWith();});',
    },
  ],
})
