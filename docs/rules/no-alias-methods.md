# Disallow alias methods (`vitest/no-alias-methods`)

<<<<<<< HEAD
⚠️ This rule _warns_ in the 🌐 `all` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->


## Rule Details

This rule disallows alias methods and forces the use of the original method.

Examples of **incorrect** code for this rule:

```js
expect(a).toBeCalled()
```

```js
expect(a).toBeCalledTimes(1)
```


Examples of **correct** code for this rule:

```js
expect(a).toHaveBeenCalled()
```

```js
expect(a).toHaveBeenCalledTimes(1)
```

## When Not To Use It

If you don't care about alias methods, you can disable this rule.
