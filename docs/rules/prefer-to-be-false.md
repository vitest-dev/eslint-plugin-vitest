# Suggest using toBeFalsy() (`vitest/prefer-to-be-false`)

⚠️ This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to enforce the use of `toBeFalsy()` over `toBeFalsy()`.

Examples of **incorrect** code for this rule:

```js
expect(foo).toBe(false)
```

Examples of **correct** code for this rule:

```js
expect(foo).toBeFalsy()
```

