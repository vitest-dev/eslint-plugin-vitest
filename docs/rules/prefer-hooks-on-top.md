# Suggest having hooks before any test cases (`vitest/prefer-hooks-on-top`)

<<<<<<< HEAD
⚠️ This rule _warns_ in the 🌐 `all` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
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