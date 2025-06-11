import rule, { RULE_NAME } from '../src/rules/no-importing-vitest-globals'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    "import { describe } from 'jest'",
    "import vitest from 'vitest'",
    "import * as vitest from 'vitest'",
    "import { \"default\" as vitest } from 'vitest'",
    "import { BenchFactory } from 'vitest'",
  ],
  invalid: [
    {
      code: "import { describe } from 'vitest'",
      errors: [{ message: "Do not import 'describe' from 'vitest'. Use globals configuration instead." }],
      output: "",
    },
    {
      code: "import { describe, it } from 'vitest'",
      errors: [
        { message: "Do not import 'describe' from 'vitest'. Use globals configuration instead." },
        { message: "Do not import 'it' from 'vitest'. Use globals configuration instead." },
      ],
      output: "",
    },
    {
      code: "import { describe, BenchFactory } from 'vitest'",
      errors: [
        { message: "Do not import 'describe' from 'vitest'. Use globals configuration instead." },
      ],
      output: "import { BenchFactory } from 'vitest'",
    }
  ]
});
