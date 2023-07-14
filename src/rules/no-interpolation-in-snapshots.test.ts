import { describe, it } from 'vitest'
import { ruleTester } from '../utils/test'
import rule, { RULE_NAME } from './no-interpolation-in-snapshots'

describe(RULE_NAME, () => {
  it(RULE_NAME, () => {
    ruleTester.run(RULE_NAME, rule, {
      valid: [
        'expect("something").toEqual("else");',
        'expect(something).toMatchInlineSnapshot();',
        'expect(something).toMatchInlineSnapshot(`No interpolation`);',
        'expect(something).toMatchInlineSnapshot({}, `No interpolation`);',
        'expect(something);',
        'expect(something).not;',
        'expect.toHaveAssertions();',
        // eslint-disable-next-line no-template-curly-in-string
        'myObjectWants.toMatchInlineSnapshot({}, `${interpolated}`);',
        // eslint-disable-next-line no-template-curly-in-string
        'myObjectWants.toMatchInlineSnapshot({}, `${interpolated1} ${interpolated2}`);',
        // eslint-disable-next-line no-template-curly-in-string
        'toMatchInlineSnapshot({}, `${interpolated}`);',
        // eslint-disable-next-line no-template-curly-in-string
        'toMatchInlineSnapshot({}, `${interpolated1} ${interpolated2}`);',
        'expect(something).toThrowErrorMatchingInlineSnapshot();',
        'expect(something).toThrowErrorMatchingInlineSnapshot(`No interpolation`);'
      ],
      invalid: [
        {
          // eslint-disable-next-line no-template-curly-in-string
          code: 'expect(something).toMatchInlineSnapshot(`${interpolated}`);',
          errors: [
            {
              messageId: 'noInterpolationInSnapshots',
              column: 41,
              line: 1
            }
          ]
        },
        {
          // eslint-disable-next-line no-template-curly-in-string
          code: 'expect(something).not.toMatchInlineSnapshot(`${interpolated}`);',
          errors: [
            {
              messageId: 'noInterpolationInSnapshots',
              column: 45,
              line: 1
            }
          ]
        },
        {
          // eslint-disable-next-line no-template-curly-in-string
          code: 'expect(something).toThrowErrorMatchingInlineSnapshot(`${interpolated}`);',
          errors: [
            {
              endColumn: 71,
              column: 54,
              messageId: 'noInterpolationInSnapshots'
            }
          ]
        },
        {
          // eslint-disable-next-line no-template-curly-in-string
          code: 'expect(something).not.toThrowErrorMatchingInlineSnapshot(`${interpolated}`);',
          errors: [
            {
              endColumn: 75,
              column: 58,
              messageId: 'noInterpolationInSnapshots'
            }
          ]
        }
      ]
    })
  })
})
