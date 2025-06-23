# no-commented-out-tests

💼⚠️ This rule is enabled in the ☑️ `legacy-recommended` config. This rule _warns_ in the 💾 `legacy-all` config.

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to prevent commented out tests.

Examples of **incorrect** code for this rule:

```ts
// test('foo', () => {
//   expect(1).toBe(1)
// })
```

Examples of **correct** code for this rule:

```ts
test('foo', () => {
  expect(1).toBe(1)
})
```
