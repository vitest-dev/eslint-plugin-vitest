# Suggest using toBeFalsy() (`vitest/prefer-to-be-falsy`)

<<<<<<< HEAD
⚠️ This rule _warns_ in the 🌐 `all` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
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

