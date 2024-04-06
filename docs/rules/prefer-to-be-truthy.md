# Suggest using `toBeTruthy` (`vitest/prefer-to-be-truthy`)

<<<<<<< HEAD
⚠️ This rule _warns_ in the 🌐 `all` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

```js
// bad
expect(foo).toBe(true)
expectTypeOf(foo).toBe(true)

// good
expect(foo).toBeTruthy()
expectTypeOf(foo).toBeTruthy()
```
