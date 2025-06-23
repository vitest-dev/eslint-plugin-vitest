# no-conditional-in-test

⚠️ This rule _warns_ in the 🌍 `legacy-all` config.

<!-- end auto-generated rule header -->

### Rule Details

This rule aims to prevent conditional tests.

Examples of **incorrect** code for this rule:

```js
test('my test', () => {
  if (true) {
    doTheThing()
  }
})
```

Examples of **correct** code for this rule:

```js
test('my test', () => {
  expect(true).toBe(true)
})
```
