# vitest/prefer-hooks-on-top

📝 Enforce having hooks before any test cases.

⚠️ This rule _warns_ in the 🌐 `all` config.

<!-- end auto-generated rule header -->

```ts
// bad

describe('foo', () => {
  it('bar', () => {
    // ...
  })

  beforeEach(() => {
    // ...
  })
})

// good

describe('foo', () => {
  beforeEach(() => {
    // ...
  })

  it('bar', () => {
    // ...
  })
})
```
