# prefer-to-be-falsy

🚫 This rule is _disabled_ in the 💾 `legacy-all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to enforce the use of `toBeFalsy()` over `toBe(false)`

Examples of **incorrect** code for this rule:

```js
expect(foo).toBe(false)
expectTypeOf(foo).toBe(false)
```

Examples of **correct** code for this rule:

```js
expect(foo).toBeFalsy()
expectTypeOf(foo).toBeFalsy()
```

