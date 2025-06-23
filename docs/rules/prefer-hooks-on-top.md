# Enforce having hooks before any test cases (`@vitest/prefer-hooks-on-top`)

⚠️ This rule _warns_ in the `legacy-all` config.

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