# no-alias-methods

⚠️ This rule _warns_ in the 💾 `legacy-all` config.

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
