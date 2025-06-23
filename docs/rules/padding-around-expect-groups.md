# padding-around-expect-groups

⚠️ This rule _warns_ in the 🔵 `legacy-all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule enforces a line of padding before _and_ after 1 or more `expect`
statements.

Note that it doesn't add/enforce a padding line if it's the last statement in
its scope and it doesn't add/enforce padding between two or more adjacent expect statements.

Examples of **incorrect** code for this rule:

```js
test('test', () => {
  let abc = 123
  expect(abc).toEqual(123)
  expect(123).toEqual(abc)
  abc = 456
  expect(abc).toEqual(456)
})
```

Examples of **correct** code for this rule:

```js
test('test', () => {
  let abc = 123

  expect(abc).toEqual(123)
  expect(123).toEqual(abc)

  abc = 456

  expect(abc).toEqual(456)
})
```
