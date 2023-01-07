# Disallow nested describes (`vitest/max-nested-describe`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

Examples of **incorrect** code for this rule with `max: 1`:

```js
describe('outer', () => {
	describe('inner', () => {
		// ...
	})
})
```

Examples of **correct** code for this rule:

```js
describe('inner', () => {
	// ...
})
```

## Options

> Default: `5`

Maximum number of nested `describe` blocks.

```js
{
	max: number
}
```
