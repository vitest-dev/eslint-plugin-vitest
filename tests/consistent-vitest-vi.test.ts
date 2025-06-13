import rule, { RULE_NAME } from '../src/rules/consistent-vitest-vi';
import { UtilName } from '../src/utils/types';
import { ruleTester } from './ruleTester';

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      code: 'import { expect, it } from "vitest";',
      options: [{ fn: UtilName.vi }],
    },
    {
      code: 'import { vi } from "vitest";',
      options: [{ fn: UtilName.vi }],
    },
    {
      code: 'import { vitest } from "vitest";',
      options: [{ fn: UtilName.vitest }],
    },
    {
      code: 'import { vi } from "vitest";\nvi.stubEnv("NODE_ENV", "production");',
      options: [{ fn: UtilName.vi }],
    },
    {
      code: 'vi.stubEnv("NODE_ENV", "production");',
      options: [{ fn: UtilName.vi }],
    },
  ],
  invalid: [
    {
      code: 'import { vitest } from "vitest";',
      options: [{ fn: UtilName.vi }],
      output: 'import { vi } from "vitest";',
      errors: [
        {
          messageId: 'consistentUtil',
          data: {
            utilKeyword: UtilName.vi,
            oppositeUtilKeyword: UtilName.vitest,
          },
          line: 1,
          column: 10,
          endColumn: 16,
        },
      ],
    },
    {
      code: 'import { expect, vi, vitest } from "vitest";',
      options: [{ fn: UtilName.vi }],
      output: 'import { expect, vi } from "vitest";',
      errors: [
        {
          messageId: 'consistentUtil',
          data: {
            utilKeyword: UtilName.vi,
            oppositeUtilKeyword: UtilName.vitest,
          },
          line: 1,
          column: 22,
          endColumn: 28,
        },
      ],
    },
    {
      code: 'import { vitest } from "vitest";\nvitest.stubEnv("NODE_ENV", "production");',
      options: [{ fn: UtilName.vi }],
      output:
        'import { vi } from "vitest";\nvi.stubEnv("NODE_ENV", "production");',
      errors: [
        {
          messageId: 'consistentUtil',
          data: {
            utilKeyword: UtilName.vi,
            oppositeUtilKeyword: UtilName.vitest,
          },
          line: 1,
          column: 10,
          endColumn: 16,
        },
        {
          messageId: 'consistentUtil',
          data: {
            utilKeyword: UtilName.vi,
            oppositeUtilKeyword: UtilName.vitest,
          },
          line: 2,
          column: 1,
          endColumn: 7,
        },
      ],
    },
    {
      code: 'vi.stubEnv("NODE_ENV", "production");\nvi.clearAllMocks();',
      options: [{ fn: UtilName.vitest }],
      output:
        'vitest.stubEnv("NODE_ENV", "production");\nvitest.clearAllMocks();',
      errors: [
        {
          messageId: 'consistentUtil',
          data: {
            utilKeyword: UtilName.vitest,
            oppositeUtilKeyword: UtilName.vi,
          },
          line: 1,
          column: 1,
          endColumn: 3,
        },
        {
          messageId: 'consistentUtil',
          data: {
            utilKeyword: UtilName.vitest,
            oppositeUtilKeyword: UtilName.vi,
          },
          line: 2,
          column: 1,
          endColumn: 3,
        },
      ],
    },
  ],
});
