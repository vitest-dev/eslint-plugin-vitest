# Disallow identical titles (`@vitest/no-identical-title`)

💼⚠️ This rule is enabled in the `legacy-recommended` config. This rule _warns_ in the `legacy-all` config.

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
