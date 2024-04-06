# Disallow focused tests (`vitest/no-focused-tests`)

<<<<<<< HEAD
⚠️ This rule _warns_ in the 🌐 `all` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

Examples of **incorrect** code for this rule:

```js
it.only('test', () => {
	// ...
})

test.only('it', () => {
	// ...
})
```

Examples of **correct** code for this rule:

```js
it('test', () => {
	// ...
})

test('it', () => {
	/* ... */
})
```
