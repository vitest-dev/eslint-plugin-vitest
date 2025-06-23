# require-hook

⚠️ This rule _warns_ in the 🌍 `legacy-all` config.

<!-- end auto-generated rule header -->

It's common when writing tests to need to perform a particular setup work before and after a test suite run. Because Vitest executes all `describe` handlers in a test file _before_ it executes any of the actual tests, it's important to ensure setup and teardown work is done inside `before*` and `after*` handlers respectively, rather than inside the `describe` blocks.

## Details

This rule flags any expression that is either at the toplevel of a test file or directly within the body of a `describe` except the following:

- `import` statements
- `const` variables
- `let` _declarations_ and initializations to `null` or `undefined`
- Classes
- Types

This rule flags any function within in a `describe` block and suggest wrapping them in one of the four lifecycle hooks.

The following patterns are considered warnings:

```ts
import { database } from './api'

describe('foo', () => {
  database.connect()

  test('bar', () => {
    // ...
  })

  database.disconnect()
})
```

The following patterns are not warnings:

```ts
describe('foo', () => {
  before(() => {
    database.connect()
  })

  test('bar', () => {
    // ...
  })
})
```

## Options

If there are methods that you want to call outside of hooks and tests, you can mark them as allowed using the `allowedFunctionCalls` option.

```json
{
  "vitest/require-hook": [
    "error",
    {
      "allowedFunctionCalls": ["database.connect"]
    }
  ]
}
```

The following patterns are not warnings because `database.connect` is allowed:

```ts
import { database } from './api'

describe('foo', () => {
  database.connect()

  test('bar', () => {
    // ...
  })

  database.disconnect()
})
```
