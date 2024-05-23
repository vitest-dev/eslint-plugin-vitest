import rule, { RULE_NAME } from '../src/rules/valid-title'
import { RuleTester } from '@typescript-eslint/rule-tester'

export const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: `${import.meta.dirname}/fixture`,
    project: `./tsconfig.json`
  }
})

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      code: `
      function foo(){}
      describe(foo, () => {
        test('item', () => {
          expect(0).toBe(0)
        })
      })
     `
    }
  ],
  invalid: []
})
