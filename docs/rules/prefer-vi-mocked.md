# Require `vi.mocked()` over `fn as Mock` (`vitest/prefer-vi-mocked`)

⚠️ This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

When working with mocks of functions using Vitest, it's recommended to use the
[vi.mocked()](https://vitest.dev/api/vi.html#vi-mocked) helper function to properly type the mocked functions.
This rule enforces the use of `vi.mocked()` for better type safety and readability.

Restricted types:

- `Mock`
- `MockedFunction`
- `MockedClass`
- `MockedObject`

## Rule details

The following patterns are warnings:

```typescript
;(foo as Mock).mockReturnValue(1)
const mock = (foo as Mock).mockReturnValue(1)
;(foo as unknown as Mock).mockReturnValue(1)
;(Obj.foo as Mock).mockReturnValue(1)
;([].foo as Mock).mockReturnValue(1)
```

The following patterns are not warnings:

```js
vi.mocked(foo).mockReturnValue(1)
const mock = vi.mocked(foo).mockReturnValue(1)
vi.mocked(Obj.foo).mockReturnValue(1)
vi.mocked([].foo).mockReturnValue(1)
```
