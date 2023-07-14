import { describe, it } from 'vitest'
import { ruleTester } from '../utils/test'
import rule, { RULE_NAME } from './no-mocks-import'

describe(RULE_NAME, () => {
  it(RULE_NAME, () => {
    ruleTester.run(RULE_NAME, rule, {
      valid: [
        'import something from "something"',
        'require("somethingElse")',
        'require("./__mocks__.js")',
        'require("./__mocks__x")',
        'require("./__mocks__x/x")',
        'require("./x__mocks__")',
        'require("./x__mocks__/x")',
        'require()',
        'var path = "./__mocks__.js"; require(path)',
        'entirelyDifferent(fn)'
      ],
      invalid: [
        {
          code: 'require("./__mocks__")',
          errors: [{ endColumn: 22, column: 9, messageId: 'noMocksImport' }]
        },
        {
          code: 'require("./__mocks__/")',
          errors: [{ endColumn: 23, column: 9, messageId: 'noMocksImport' }]
        },
        {
          code: 'require("./__mocks__/index")',
          errors: [{ endColumn: 28, column: 9, messageId: 'noMocksImport' }]
        },
        {
          code: 'require("__mocks__")',
          errors: [{ endColumn: 20, column: 9, messageId: 'noMocksImport' }]
        },
        {
          code: 'require("__mocks__/")',
          errors: [{ endColumn: 21, column: 9, messageId: 'noMocksImport' }]
        },
        {
          code: 'require("__mocks__/index")',
          errors: [{ endColumn: 26, column: 9, messageId: 'noMocksImport' }]
        },
        {
          code: 'import thing from "./__mocks__/index"',
          parserOptions: { sourceType: 'module' },
          errors: [{ endColumn: 38, column: 1, messageId: 'noMocksImport' }]
        }
      ]
    })
  })
})
