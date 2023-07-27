# Prefer `each` rather than manual loops (`vitest/prefer-each`)

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