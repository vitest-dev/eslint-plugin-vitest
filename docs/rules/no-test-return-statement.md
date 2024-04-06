# Disallow return statements in tests (`vitest/no-test-return-statement`)

<<<<<<< HEAD
⚠️ This rule _warns_ in the 🌐 `all` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
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
