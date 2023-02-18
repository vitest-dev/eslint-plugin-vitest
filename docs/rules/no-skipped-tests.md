# Disallow skipped tests (`vitest/no-skipped-tests`)

⚠️ This rule _warns_ in the 🌐 `all` config.

<!-- end auto-generated rule header -->

## Rule Details

Examples of **incorrect** code for this rule:

```js
it.skip('test', () => {
	/* ... */
})

test.skip('it', () => {
	/* ... */
})
```

Examples of **correct** code for this rule:

```js
it('test', () => {
	/* ... */
})

test('it', () => {
	/* ... */
})
```
