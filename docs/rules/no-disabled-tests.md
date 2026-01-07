# vitest/no-disabled-tests

📝 Disallow disabled tests.

⚠️ This rule _warns_ in the following configs: 🌐 `all`, ✅ `recommended`.

<!-- end auto-generated rule header -->

## Rule Details

This rule disallows disabled tests.

Examples of **incorrect** code for this rule:

```ts
test.skip('foo', () => {
  // ...
})
```

Examples of **correct** code for this rule:

```ts
test('foo', () => {
  // ...
})
```
