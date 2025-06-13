import rule, { RULE_NAME } from '../src/rules/consistent-vitest-vi'
import { HelperName } from '../src/utils/types'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      code: 'import { expect, it } from "vitest";',
      options: [{ fn: HelperName.vi }]
    },
    {
      code: 'import { vi } from "vitest";',
      options: [{ fn: HelperName.vi }]
    },
    {
      code: 'import { vitest } from "vitest";',
      options: [{ fn: HelperName.vitest }]
    },
    {
      code: 'import { vi } from "vitest";\nvi.stubEnv("NODE_ENV", "production");',
      options: [{ fn: HelperName.vi }]
    },
    {
      code: 'vi.stubEnv("NODE_ENV", "production");',
      options: [{ fn: HelperName.vi }]
    }
  ],
  invalid: [
    {
      code: 'import { vitest } from "vitest";',
      options: [{ fn: HelperName.vi }],
      output: 'import { vi } from "vitest";',
      errors: [
        {
          messageId: 'consistentHelper',
          data: {
            helperKeyword: HelperName.vi,
            oppositeHelperKeyword: HelperName.vitest
          },
          line: 1,
          column: 10,
          endColumn: 16
        }
      ]
    },
    {
      code: 'import { expect, vi, vitest } from "vitest";',
      options: [{ fn: HelperName.vi }],
      output: 'import { expect, vi } from "vitest";',
      errors: [
        {
          messageId: 'consistentHelper',
          data: {
            helperKeyword: HelperName.vi,
            oppositeHelperKeyword: HelperName.vitest
          },
          line: 1,
          column: 22,
          endColumn: 28
        }
      ]
    },
    {
      code: 'import { vitest } from "vitest";\nvitest.stubEnv("NODE_ENV", "production");',
      options: [{ fn: HelperName.vi }],
      output:
        'import { vi } from "vitest";\nvi.stubEnv("NODE_ENV", "production");',
      errors: [
        {
          messageId: 'consistentHelper',
          data: {
            helperKeyword: HelperName.vi,
            oppositeHelperKeyword: HelperName.vitest
          },
          line: 1,
          column: 10,
          endColumn: 16
        },
        {
          messageId: 'consistentHelper',
          data: {
            helperKeyword: HelperName.vi,
            oppositeHelperKeyword: HelperName.vitest
          },
          line: 2,
          column: 1,
          endColumn: 7
        }
      ]
    },
    {
      code: 'vi.stubEnv("NODE_ENV", "production");\nvi.clearAllMocks();',
      options: [{ fn: HelperName.vitest }],
      output:
        'vitest.stubEnv("NODE_ENV", "production");\nvitest.clearAllMocks();',
      errors: [
        {
          messageId: 'consistentHelper',
          data: {
            helperKeyword: HelperName.vitest,
            oppositeHelperKeyword: HelperName.vi
          },
          line: 1,
          column: 1,
          endColumn: 3
        },
        {
          messageId: 'consistentHelper',
          data: {
            helperKeyword: HelperName.vitest,
            oppositeHelperKeyword: HelperName.vi
          },
          line: 2,
          column: 1,
          endColumn: 3
        }
      ]
    }
  ]
})
