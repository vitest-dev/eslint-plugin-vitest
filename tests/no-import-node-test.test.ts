import rule from '../src/rules/no-import-node-test'
import { ruleTester } from './ruleTester'

ruleTester.run(rule.name, rule, {
  valid: ['import { test } from "vitest"'],
  invalid: [
    {
      code: 'import { test } from "node:test"',
      output: 'import { test } from "vitest"',
      errors: [{ messageId: 'noImportNodeTest' }],
    },
    {
      code: "import * as foo from 'node:test'",
      output: "import * as foo from 'vitest'",
      errors: [{ messageId: 'noImportNodeTest' }],
    },
  ],
})
