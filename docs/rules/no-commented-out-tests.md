# Disallow commented out tests (`vitest/no-commented-out-tests`)

<<<<<<< HEAD
💼 This rule is enabled in the ✅ `recommended` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
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
