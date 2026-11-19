# vitest/no-commented-out-tests

📝 Disallow commented out tests.

💼⚠️ This rule is enabled in the ✅ `recommended` config. This rule _warns_ in the 🌐 `all` config.

<!-- end auto-generated rule header -->

## Rationale

Commented-out tests do not run and do not show up in the test report, so the behavior they covered is silently left untested and they are easily forgotten. Delete the test, fix it, or mark it with `test.skip()` or `test.todo()` so it stays visible.

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
