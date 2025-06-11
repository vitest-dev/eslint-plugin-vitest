import rule, { RULE_NAME } from '../src/rules/no-importing-vitest-globals'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    "import { describe } from 'jest'",
    "import vitest from 'vitest'",
    "import * as vitest from 'vitest'",
    "import { \"default\" as vitest } from 'vitest'",
    "import { BenchFactory } from 'vitest'",
    "let x;",
    "let x = 1;",
    "const x = console.log('hello');",
    "const x = print('hello');",
    "const x = require('something', 'wrong');", // let it be handled by other rules
    "const x = require(a_variable);",           // edge case, cannot determine whether it is vitest
    "const x = require('jest')",
    "const x = require('vitest')",
    "const { ...rest } = require('vitest')",
    "const { \"default\": vitest } = require('vitest')",
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
    },
    {
      code: "import { BenchFactory, describe } from 'vitest'",
      errors: [
        { message: "Do not import 'describe' from 'vitest'. Use globals configuration instead." },
      ],
      output: "import { BenchFactory } from 'vitest'",
    },
    {
      code: "import { describe, BenchFactory, it } from 'vitest'",
      errors: [
        { message: "Do not import 'describe' from 'vitest'. Use globals configuration instead." },
        { message: "Do not import 'it' from 'vitest'. Use globals configuration instead." },
      ],
      output: "import { BenchFactory } from 'vitest'",
    },
    {
      code: "import { BenchTask, describe, BenchFactory, it } from 'vitest'",
      errors: [
        { message: "Do not import 'describe' from 'vitest'. Use globals configuration instead." },
        { message: "Do not import 'it' from 'vitest'. Use globals configuration instead." },
      ],
      output: "import { BenchTask, BenchFactory } from 'vitest'",
    },
    {
      code: "const { describe } = require('vitest')",
      errors: [{ message: "Do not require 'describe' from 'vitest'. Use globals configuration instead." }],
    },
  ]
});
