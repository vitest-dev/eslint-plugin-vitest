# Prefer `each` rather than manual loops (`vitest/prefer-each`)

<<<<<<< HEAD
⚠️ This rule _warns_ in the 🌐 `all` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
<!-- end auto-generated rule header -->

```js
// bad
for (const item of items) {
  describe(item, () => {
	expect(item).toBe('foo')
  })
}

// good
describe.each(items)('item', (item) => {
  expect(item).toBe('foo')
})
```