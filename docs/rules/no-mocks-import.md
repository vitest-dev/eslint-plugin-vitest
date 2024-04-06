# Disallow importing from __mocks__ directory (`vitest/no-mocks-import`)

<<<<<<< HEAD
⚠️ This rule _warns_ in the 🌐 `all` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
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
