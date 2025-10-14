import rule from '../src/rules/consistent-test-filename'
import { ruleTester } from './ruleTester'

ruleTester.run(`file-name`, rule, {
  valid: [
    {
      code: 'export {}',
      filename: '1.test.ts',
    },
    {
      code: 'export {}',
      filename: '1.spec.ts',
      options: [{ pattern: String.raw`.*\.spec\.ts$` }],
    },
  ],
  invalid: [
    {
      code: 'export {}',
      filename: '1.spec.ts',
      errors: [{ messageId: 'consistentTestFilename' }],
    },
    {
      code: 'export {}',
      filename: '__tests__/2.ts',
      errors: [{ messageId: 'consistentTestFilename' }],
      options: [
        {
          allTestPattern: String.raw`__tests__`,
          pattern: String.raw`.*\.spec\.ts$`,
        },
      ],
    },
  ],
})
