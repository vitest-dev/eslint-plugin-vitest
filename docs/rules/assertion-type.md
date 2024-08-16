# Enforce assertion type (`@vitest/assertion-type`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

Examples of **incorrect** code for this rule with the default options:

```js
assert(2 + 2 !== 'fish', 'two plus two is not equal to fish')
```

Examples of **correct** code for this rule with the default options:

```js
expect(2 + 2).not.toEqual('fish')
```

## Options

### `type`

> Default: `"jest"`

Whether to use Chai (`assert(...)`) or Jest (`expect(...)`) style assertions.

```js
{
	type: 'chai' | 'jest'
}
```
