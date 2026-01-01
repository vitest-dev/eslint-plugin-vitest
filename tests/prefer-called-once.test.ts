import rule from '../src/rules/prefer-called-once'
import { ruleTester } from './ruleTester'

ruleTester.run(rule.name, rule, {
  valid: [
    'expect(fn).toBeCalledOnce();',
    'expect(fn).toHaveBeenCalledOnce();',
    'expect(fn).toBeCalledTimes(2);',
    'expect(fn).toHaveBeenCalledTimes(2);',
    'expect(fn).toBeCalledTimes(expect.anything());',
    'expect(fn).toHaveBeenCalledTimes(expect.anything());',
    'expect(fn).not.toBeCalledOnce();',
    'expect(fn).rejects.not.toBeCalledOnce();',
    'expect(fn).not.toHaveBeenCalledOnce();',
    'expect(fn).resolves.not.toHaveBeenCalledOnce();',
    'expect(fn).toBeCalledTimes(0);',
    'expect(fn).toHaveBeenCalledTimes(0);',
    'expect(fn);',
  ],
  invalid: [
    {
      code: 'expect(fn).toBeCalledTimes(1);',
      errors: [
        {
          messageId: 'preferCalledOnce',
          data: { replacedMatcherName: 'toBeCalledOnce' },
          column: 12,
          line: 1,
        },
      ],
      output: 'expect(fn).toBeCalledOnce();',
    },
    {
      code: 'expect(fn).toHaveBeenCalledTimes(1);',
      errors: [
        {
          messageId: 'preferCalledOnce',
          data: { replacedMatcherName: 'toHaveBeenCalledOnce' },
          column: 12,
          line: 1,
        },
      ],
      output: 'expect(fn).toHaveBeenCalledOnce();',
    },
    {
      code: 'expect(fn).not.toBeCalledTimes(1);',
      errors: [
        {
          messageId: 'preferCalledOnce',
          data: { replacedMatcherName: 'toBeCalledOnce' },
          column: 16,
          line: 1,
        },
      ],
      output: 'expect(fn).not.toBeCalledOnce();',
    },
    {
      code: 'expect(fn).not.toHaveBeenCalledTimes(1);',
      errors: [
        {
          messageId: 'preferCalledOnce',
          data: { replacedMatcherName: 'toHaveBeenCalledOnce' },
          column: 16,
          line: 1,
        },
      ],
      output: 'expect(fn).not.toHaveBeenCalledOnce();',
    },
    {
      code: 'expect(fn).resolves.toBeCalledTimes(1);',
      errors: [
        {
          messageId: 'preferCalledOnce',
          data: { replacedMatcherName: 'toBeCalledOnce' },
          column: 21,
          line: 1,
        },
      ],
      output: 'expect(fn).resolves.toBeCalledOnce();',
    },
    {
      code: 'expect(fn).resolves.toHaveBeenCalledTimes(1);',
      errors: [
        {
          messageId: 'preferCalledOnce',
          data: { replacedMatcherName: 'toHaveBeenCalledOnce' },
          column: 21,
          line: 1,
        },
      ],
      output: 'expect(fn).resolves.toHaveBeenCalledOnce();',
    },
  ],
})
