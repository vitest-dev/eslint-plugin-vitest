import rule, { RULE_NAME } from '../src/rules/no-importing-vitest-globals'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    "import { describe } from 'jest'",
  ],
  invalid: [
    {
      code: "import { describe } from 'vitest'",
      errors: [{ messageId: "noImportingVitestGlobals" }],
    }
  ]
});
