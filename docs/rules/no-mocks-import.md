# no-mocks-import

⚠️ This rule _warns_ in the 🔵 `legacy-all` config.

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
