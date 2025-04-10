import { RuleTester } from '@typescript-eslint/rule-tester'
import rule, { RULE_NAME } from '../src/rules/prefer-describe-function-title'

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: `${import.meta.dirname}/fixture`,
      project: true
    }
  }
})

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      code: `
        import { myFunction } from "./myFunction"
        describe()
      `,
      filename: 'myFunction.test.ts'
    },
    {
      code: `
        import { myFunction } from "./myFunction"
        describe("myFunction")
      `,
      filename: 'myFunction.test.ts'
    },
    {
      code: `
        import { myFunction } from "./myFunction"
        describe.todo("myFunction")
      `,
      filename: 'myFunction.test.ts'
    },
    {
      code: `
        import { myFunction } from "./myFunction"
        describe.each("myFunction", () => {})
      `,
      filename: 'myFunction.test.ts'
    },
    {
      code: `
        import { myFunction } from "./myFunction"
        describe(() => {})
      `,
      filename: 'myFunction.test.ts'
    },
    {
      code: `
        import { myFunction } from "./myFunction"
        describe("other", () => {})
      `,
      filename: 'myFunction.test.ts'
    },
    {
      code: `
        import { myFunction } from "./myFunction"
        it("myFunction", () => {})
      `,
      filename: 'myFunction.test.ts'
    },
    {
      code: `
        import { myFunction } from "./myFunction"
        test("myFunction", () => {})
      `,
      filename: 'myFunction.test.ts'
    },
    {
      code: `
        import { other } from "./other.js"
        describe("myFunction", () => {})
      `,
      filename: 'myFunction.test.ts'
    },
    {
      code: `
        declare const myFunction: () => unknown
        describe("myFunction", () => {})
      `,
      filename: 'myFunction.test.ts'
    },
    {
      code: `
        const myFunction = ""
        describe("myFunction", () => {})
      `,
      filename: 'myFunction.test.ts',
      settings: {
        vitest: {
          typecheck: true
        }
      }
    }
  ],
  invalid: [
    {
      code: `
        import { myFunction } from "./myFunction"
        describe("myFunction", () => {})
      `,
      errors: [
        {
          column: 18,
          line: 3,
          messageId: 'preferFunction'
        }
      ],
      filename: 'myFunction.test.ts',
      output: `
        import { myFunction } from "./myFunction"
        describe(myFunction, () => {})
      `
    },
    {
      code: `
        import { myFunction } from "./myFunction"
        if (someProcessEnvCheck) {
          describe("myFunction", () => {})
        }
      `,
      errors: [
        {
          column: 20,
          line: 4,
          messageId: 'preferFunction'
        }
      ],
      filename: 'myFunction.test.ts',
      output: `
        import { myFunction } from "./myFunction"
        if (someProcessEnvCheck) {
          describe(myFunction, () => {})
        }
      `
    },
    {
      code: `
        import { myFunction } from "./myFunction"
        describe("myFunction", () => {})
      `,
      errors: [
        {
          column: 18,
          line: 3,
          messageId: 'preferFunction'
        }
      ],
      filename: 'myFunction.test.ts',
      output: `
        import { myFunction } from "./myFunction"
        describe(myFunction, () => {})
      `,
      settings: {
        vitest: {
          typecheck: true
        }
      }
    }
  ]
})
