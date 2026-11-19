# vitest/no-mocks-import

📝 Disallow importing from **mocks** directory.

💼⚠️ This rule is enabled in the ✅ `recommended` config. This rule _warns_ in the 🌐 `all` config.

<!-- end auto-generated rule header -->

## Rationale

Files in a `__mocks__` directory are meant to be picked up by `vi.mock()`, not imported directly. Importing them bypasses that mechanism: the code under test still uses the real module unless it is mocked, so the test may not exercise what it seems to. Mock the original module path instead.

## Rule Details

This rule aims to prevent importing from the `__mocks__` directory.

### Fail

```ts
import { foo } from '__mocks__/foo'
```

### Pass

```ts
import { foo } from 'foo'
```
