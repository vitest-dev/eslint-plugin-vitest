# prefer-importing-vitest-globals

⚠️ This rule _warns_ in the 🌍 `legacy-all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

⚠️ This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Rule Details

This rule enforces importing [Vitest globals](https://vitest.dev/config/#globals).

Examples of **incorrect** code for this rule:

```ts
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

```ts
const { test, expect } = require('vitest')

test('foo', () => {
  expect(1).toBe(1)
})
```
