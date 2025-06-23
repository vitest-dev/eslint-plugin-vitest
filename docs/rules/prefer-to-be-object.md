# prefer-to-be-object

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

```js
expectTypeOf({}).not.toBeInstanceOf(Object)

// should be
expectTypeOf({}).not.toBeObject()
```
