import rule, { RULE_NAME } from '../src/rules/prefer-called-exactly-once-with'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'expect(fn).toHaveBeenCalledExactlyOnceWith();',
    'expect(x). toHaveBeenCalledExactlyOnceWith(args);',
  ],
  invalid: [
    {
      code: 'expect(x).toHaveBeenCalledOnce();',
      errors: [
        {
          messageId: 'preferCalledExactlyOnceWith',
          data: { matcherName: 'toHaveBeenCalledOnce' },
          column: 11,
          line: 1,
        },
      ],
      output: 'expect(x).toHaveBeenCalledOnceExactlyOnceWith();',
    },
    {
      code: 'expect(x).toHaveBeenCalledWith();',
      errors: [
        {
          messageId: 'preferCalledExactlyOnceWith',
          data: { matcherName: 'toHaveBeenCalledWith' },
          column: 11,
          line: 1,
        },
      ],
      output: 'expect(x).toHaveBeenCalledWithExactlyOnceWith();',
    },
  ],
})
