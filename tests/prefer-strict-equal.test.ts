import rule from '../src/rules/prefer-strict-equal'
import { ruleTester } from './ruleTester'

ruleTester.run(rule.name, rule, {
  valid: [
    'expect(something).toStrictEqual(somethingElse);',
    "a().toEqual('b')",
    'expect(a);',
  ],
  invalid: [
    {
      code: 'expect(something).toEqual(somethingElse);',
      errors: [
        {
          messageId: 'useToStrictEqual',
          column: 19,
          line: 1,
          suggestions: [
            {
              messageId: 'suggestReplaceWithStrictEqual',
              output: 'expect(something).toStrictEqual(somethingElse);',
            },
          ],
        },
      ],
    },
    {
      code: 'expect(something).toEqual(somethingElse,);',
      languageOptions: { parserOptions: { ecmaVersion: 2017 } },
      errors: [
        {
          messageId: 'useToStrictEqual',
          column: 19,
          line: 1,
          suggestions: [
            {
              messageId: 'suggestReplaceWithStrictEqual',
              output: 'expect(something).toStrictEqual(somethingElse,);',
            },
          ],
        },
      ],
    },
    {
      code: 'expect(something)["toEqual"](somethingElse);',
      errors: [
        {
          messageId: 'useToStrictEqual',
          column: 19,
          line: 1,
          suggestions: [
            {
              messageId: 'suggestReplaceWithStrictEqual',
              output: "expect(something)['toStrictEqual'](somethingElse);",
            },
          ],
        },
      ],
    },
  ],
})
