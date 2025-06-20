import rule, { RULE_NAME } from '../src/rules/prefer-called-times'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'expect(fn).toBeCalledTimes(1);',
    'expect(fn).toHaveBeenCalledTimes(1);',
    'expect(fn).toBeCalledTimes(2);',
    'expect(fn).toHaveBeenCalledTimes(2);',
    'expect(fn).toBeCalledTimes(expect.anything());',
    'expect(fn).toHaveBeenCalledTimes(expect.anything());',
    'expect(fn).not.toBeCalledTimes(2);',
    'expect(fn).rejects.not.toBeCalledTimes(1);',
    'expect(fn).not.toHaveBeenCalledTimes(1);',
    'expect(fn).resolves.not.toHaveBeenCalledTimes(1);',
    'expect(fn).toBeCalledTimes(0);',
    'expect(fn).toHaveBeenCalledTimes(0);',
    'expect(fn);',
  ],
  invalid: [
    {
      code: 'expect(fn).toBeCalledOnce();',
      errors: [
        {
          messageId: 'preferCalledTimes',
          data: { replacedMatcherName: 'toBeCalledTimes' },
          column: 12,
          line: 1,
        },
      ],
      output: 'expect(fn).toBeCalledTimes(1);',
    },
    {
      code: 'expect(fn).toHaveBeenCalledOnce();',
      errors: [
        {
          messageId: 'preferCalledTimes',
          data: { replacedMatcherName: 'toHaveBeenCalledTimes' },
          column: 12,
          line: 1,
        },
      ],
      output: 'expect(fn).toHaveBeenCalledTimes(1);',
    },
    {
      code: 'expect(fn).not.toBeCalledOnce();',
      errors: [
        {
          messageId: 'preferCalledTimes',
          data: { replacedMatcherName: 'toBeCalledTimes' },
          column: 16,
          line: 1,
        },
      ],
      output: 'expect(fn).not.toBeCalledTimes(1);',
    },
    {
      code: 'expect(fn).not.toHaveBeenCalledOnce();',
      errors: [
        {
          messageId: 'preferCalledTimes',
          data: { replacedMatcherName: 'toHaveBeenCalledTimes' },
          column: 16,
          line: 1,
        },
      ],
      output: 'expect(fn).not.toHaveBeenCalledTimes(1);',
    },
    {
      code: 'expect(fn).resolves.toBeCalledOnce();',
      errors: [
        {
          messageId: 'preferCalledTimes',
          data: { replacedMatcherName: 'toBeCalledTimes' },
          column: 21,
          line: 1,
        },
      ],
      output: 'expect(fn).resolves.toBeCalledTimes(1);',
    },
    {
      code: 'expect(fn).resolves.toHaveBeenCalledOnce();',
      errors: [
        {
          messageId: 'preferCalledTimes',
          data: { replacedMatcherName: 'toHaveBeenCalledTimes' },
          column: 21,
          line: 1,
        },
      ],
      output: 'expect(fn).resolves.toHaveBeenCalledTimes(1);',
    },
  ],
})
