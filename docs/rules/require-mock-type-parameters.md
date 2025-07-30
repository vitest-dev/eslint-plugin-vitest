# Enforce using type parameters with vitest mock functions (`vitest/require-mock-type-parameters`)

⚠️ This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

When using `vi.fn()` to mock functions, by default, the mocked function has the type of `(...args: any[]) => any`. To add more specific types to the mocked function, a type parameter needs to be added to the call, e.g. `vi.fn<(arg1: string, arg2: boolean) => number>()`.

Additionally, there are two more mock functions with type parameters that cannot be automatically inferred by the TypeScript compiler, `vi.importActual` and `vi.importMock`. This rule doesn't by default report these function, however, the check can be enabled by setting the `checkImportFunctions` rule option.

The following patterns are considered bad:

```ts
import { vi } from 'vitest'

test('foo', () => {
  const myMockedFn = vi.fn()
})
```

The following patterns are considered OK:

```ts
import { vi } from 'vitest'

test('foo', () => {
  const myMockedFnOne = vi.fn<(arg1: string, arg2: boolean) => number>()
  const myMockedFnTwo = vi.fn<() => void>()
  const myMockedFnThree = vi.fn<any>()
})
```

## Options

```json
{
  "vitest/require-mock-type-parameters": [
    "error",
    {
      "checkImportFunctions": false
    }
  ]
}
```

The following patterns are considered bad with `checkImportFunctions: true`:

```ts
import { vi } from 'vitest'

vi.mock('./example.js', async () => {
  const originalModule = await vi.importActual('./example.js')

  return { ...originalModule }
})
```

```ts
const fs = await vi.importMock('fs')
```
