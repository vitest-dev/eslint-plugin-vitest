# vitest/no-import-node-test

📝 Disallow importing `node:test`.

💼⚠️ This rule is enabled in the ✅ `recommended` config. This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rationale

`node:test` also exports `test`, `describe` and `it`, so an editor auto-import can easily pick it instead of `vitest`. Tests registered through `node:test` are not collected and reported by Vitest, so they silently stop being part of your test run.

## Rule Details

This rule warns when `node:test` is imported (usually accidentally). With `--fix`, it will replace the import with `vitest`.

Examples of **incorrect** code for this rule:

```ts
import { test } from 'node:test'
import { expect } from 'vitest'

test('foo', () => {
  expect(1).toBe(1)
})
```

Examples of **correct** code for this rule:

```ts
import { test, expect } from 'vitest'

test('foo', () => {
  expect(1).toBe(1)
})
```
