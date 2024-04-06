# Disallow identical titles (`vitest/no-identical-title`)

<<<<<<< HEAD
💼 This rule is enabled in the ✅ `recommended` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

Examples of **incorrect** code for this rule:

```js
it('is awesome', () => {
	/* ... */
})

it('is awesome', () => {
	/* ... */
})
```

Examples of **correct** code for this rule:

```js
it('is awesome', () => {
	/* ... */
})

it('is very awesome', () => {
	/* ... */
})
```
