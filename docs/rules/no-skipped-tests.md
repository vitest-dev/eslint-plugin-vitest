# Disallow skipped tests (`vitest/no-skipped-tests`)

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
