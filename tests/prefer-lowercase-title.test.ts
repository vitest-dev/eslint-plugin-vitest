import rule, { RULE_NAME } from '../src/rules/prefer-lowercase-title'
import { TestCaseName } from '../src/utils/types'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'it.each()',
    'it.each()(1)',
    'it.todo();',
    'describe("oo", function () {})',
    'test("foo", function () {})',
    'test(`123`, function () {})'
  ],
  invalid: [
    {
      code: 'it("Foo MM mm", function () {})',
      output: 'it("foo MM mm", function () {})',
      errors: [
        {
          messageId: 'lowerCaseTitle',
          data: {
            method: TestCaseName.it
          }
        }
      ]
    },
    {
      code: 'test(`Foo MM mm`, function () {})',
      output: 'test(`foo MM mm`, function () {})',
      errors: [
        {
          messageId: 'lowerCaseTitle',
          data: {
            method: TestCaseName.test
          }
        }
      ]
    },
    {
      code: 'test(`SFC Compile`, function () {})',
      output: 'test(`sfc compile`, function () {})',
      errors: [
        {
          messageId: 'fullyLowerCaseTitle',
          data: {
            method: TestCaseName.test
          }
        }
      ],
      options: [
        {
          lowercaseFirstCharacterOnly: false
        }
      ]
    },
    {
      code: 'bench(`Foo MM mm`, function () {})',
      output: 'bench(`foo MM mm`, function () {})',
      errors: [
        {
          messageId: 'lowerCaseTitle',
          data: {
            method: TestCaseName.bench
          }
        }
      ]
    }
  ]
})
