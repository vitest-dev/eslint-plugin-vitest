# Prefer `each` rather than manual loops (`vitest/prefer-each`)

⚠️ This rule _warns_ in the `all-legacy` config.

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