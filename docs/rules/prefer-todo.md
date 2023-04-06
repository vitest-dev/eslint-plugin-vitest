# Suggest using `test.todo` (`vitest/prefer-todo`)

⚠️ This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

When tests are empty it's better to mark them as `test.todo` as it will be highlighted in tests summary output.

### Rule details

The following pattern is considered a warning:

```js
test('foo');
test('foo', () => {})
test.skip('foo', () => {})
```

The following pattern is not considered a warning:

```js
test.todo('foo');
```
