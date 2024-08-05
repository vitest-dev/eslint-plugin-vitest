import rule, { RULE_NAME } from '../src/rules/prefer-strict-equal'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'expect(something).toStrictEqual(somethingElse);',
    'a().toEqual(\'b\')',
    'expect(a);'
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
              output: 'expect(something).toStrictEqual(somethingElse);'
            }
          ]
        }
      ]
    },
    {
      code: 'expect(something).toEqual(somethingElse,);',
<<<<<<< HEAD
      parserOptions: {  languageOptions: { parserOptions: { ecmaVersion: 2017 } } },
=======
      languageOptions: { languageOptions: { parserOptions: { ecmaVersion: 2017 } } },
>>>>>>> 18602a719a4879119c1e24a5700c3f783e2078fd
      errors: [
        {
          messageId: 'useToStrictEqual',
          column: 19,
          line: 1,
          suggestions: [
            {
              messageId: 'suggestReplaceWithStrictEqual',
              output: 'expect(something).toStrictEqual(somethingElse,);'
            }
          ]
        }
      ]
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
              output: 'expect(something)[\'toStrictEqual\'](somethingElse);'
            }
          ]
        }
      ]
    }
  ]
})
