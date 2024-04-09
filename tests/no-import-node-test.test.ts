import rule, { RULE_NAME } from '../src/rules/no-import-node-test'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'import { test } from "vitest"'
  ],
  invalid: [
    {
      code: 'import { test } from "node:test"',
      output: 'import { test } from "vitest"',
      errors: [{ messageId: 'noImportNodeTest' }]
    },
    {
      code: 'import * as foo from \'node:test\'',
      output: 'import * as foo from \'vitest\'',
      errors: [{ messageId: 'noImportNodeTest' }]
    }
  ]
})
