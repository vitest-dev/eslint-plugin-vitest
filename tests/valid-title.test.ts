import rule, { RULE_NAME } from '../src/rules/valid-title'
import { RuleTester } from '@typescript-eslint/rule-tester'

console.log(`HERE: ${import.meta.dirname}`)

export const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: `./fixture`,
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
