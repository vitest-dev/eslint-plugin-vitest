import rule from '../src/rules/consistent-test-filename'
import { ruleTester } from './ruleTester'

ruleTester.run(`file-name`, rule, {
  valid: [
    {
      code: 'export {}',
      filename: '1.test.ts',
      options: [{ pattern: String.raw`.*\.test\.ts$` }]
    }
  ],
  invalid: [
    {
      code: 'export {}',
      filename: '1.spec.ts',
      errors: [{ messageId: 'consistentTestFilename' }],
      options: [{ pattern: String.raw`.*\.test\.ts$` }]
    }
  ]
})
