# Disallow importing `node:test` (`vitest/no-import-node-test`)

⚠️ This rule _warns_ in the 🌐 `all` config.

<!-- end auto-generated rule header -->

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
