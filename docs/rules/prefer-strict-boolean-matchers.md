# prefer-strict-boolean-matchers

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule enforces using `toBe(true)` and `toBe(false)`, which only match if the value is the corresponding boolean value. This is unlike `toBeTruthy()`, which matches any truthy value, such as a non-zero number or a non-empty string (which are, conversely, matched by `toBeFalsy()`).

```js
// bad
expect(foo).toBeTruthy()
expectTypeOf(foo).toBeTruthy()
expect(foo).toBeFalsy()
expectTypeOf(foo).toBeFalsy()

// good
expect(foo).toBe(true)
expectTypeOf(foo).toBe(true)
expect(foo).toBe(false)
expectTypeOf(foo).toBe(false)
```
