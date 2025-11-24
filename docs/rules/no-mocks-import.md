# Disallow importing from **mocks** directory (`vitest/no-mocks-import`)

💼⚠️ This rule is enabled in the ✅ `recommended` config. This rule _warns_ in the 🌐 `all` config.

<!-- end auto-generated rule header -->

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
