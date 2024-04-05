# Suggest having hooks before any test cases (`vitest/prefer-hooks-on-top`)

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