# Suggest using toHaveLength() (`vitest/prefer-to-have-length`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->
```js
// bad
expect(files.length).toStrictEqual(1);

// good
expect(files).toHaveLength(1);
```