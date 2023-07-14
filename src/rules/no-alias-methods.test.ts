import { describe, it } from 'vitest'
import { ruleTester } from '../utils/test'
import rule, { RULE_NAME } from './no-alias-methods'

describe(RULE_NAME, () => {
  it(RULE_NAME, () => {
    ruleTester.run(RULE_NAME, rule, {
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
        'expect(a).toThrow()',
        'expect(a).rejects;',
        'expect(a);'
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
                canonical: 'toHaveBeenCalled'
              },
              column: 11,
              line: 1
            }
          ]
        },
        {
          code: 'expect(a).toBeCalledTimes()',
          output: 'expect(a).toHaveBeenCalledTimes()',
          errors: [
            {
              messageId: 'noAliasMethods',
              data: {
                alias: 'toBeCalledTimes',
                canonical: 'toHaveBeenCalledTimes'
              },
              column: 11,
              line: 1
            }
          ]
        },
        {
          code: 'expect(a).not["toThrowError"]()',
          output: 'expect(a).not[\'toThrow\']()',
          errors: [
            {
              messageId: 'noAliasMethods',
              data: {
                alias: 'toThrowError',
                canonical: 'toThrow'
              },
              column: 15,
              line: 1
            }
          ]
        }
      ]
    })
  })
})
