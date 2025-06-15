import rule, { RULE_NAME } from '../src/rules/no-interpolation-in-snapshots'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'expect("something").toEqual("else");',
    'expect(something).toMatchInlineSnapshot();',
    'expect(something).toMatchInlineSnapshot(`No interpolation`);',
    'expect(something).toMatchInlineSnapshot({}, `No interpolation`);',
    'expect(something);',
    'expect(something).not;',
    'expect.toHaveAssertions();',

    'myObjectWants.toMatchInlineSnapshot({}, `${interpolated}`);',

    'myObjectWants.toMatchInlineSnapshot({}, `${interpolated1} ${interpolated2}`);',

    'toMatchInlineSnapshot({}, `${interpolated}`);',

    'toMatchInlineSnapshot({}, `${interpolated1} ${interpolated2}`);',
    'expect(something).toThrowErrorMatchingInlineSnapshot();',
    'expect(something).toThrowErrorMatchingInlineSnapshot(`No interpolation`);',
  ],
  invalid: [
    {
      code: 'expect(something).toMatchInlineSnapshot(`${interpolated}`);',
      errors: [
        {
          messageId: 'noInterpolationInSnapshots',
          column: 41,
          line: 1,
        },
      ],
    },
    {
      code: 'expect(something).not.toMatchInlineSnapshot(`${interpolated}`);',
      errors: [
        {
          messageId: 'noInterpolationInSnapshots',
          column: 45,
          line: 1,
        },
      ],
    },
    {
      code: 'expect(something).toThrowErrorMatchingInlineSnapshot(`${interpolated}`);',
      errors: [
        {
          endColumn: 71,
          column: 54,
          messageId: 'noInterpolationInSnapshots',
        },
      ],
    },
    {
      code: 'expect(something).not.toThrowErrorMatchingInlineSnapshot(`${interpolated}`);',
      errors: [
        {
          endColumn: 75,
          column: 58,
          messageId: 'noInterpolationInSnapshots',
        },
      ],
    },
  ],
})
