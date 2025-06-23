# no-test-return-statement

⚠️ This rule _warns_ in the 🔵 `legacy-all` config.

<!-- end auto-generated rule header -->

### Rule Details

incorrect code for this rule:

```ts
import { test } from 'vitest'

test('foo', () => {
  return expect(1).toBe(1)
})
```

correct code for this rule:

```ts
import { test } from 'vitest'

test('foo', () => {
  expect(1).toBe(1)
})
```
