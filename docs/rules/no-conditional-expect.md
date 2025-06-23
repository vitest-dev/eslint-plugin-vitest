# no-conditional-expect

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to prevent conditional expects.

Examples of **incorrect** code for this rule:

```ts
test('foo', () => {
  if (true) {
    expect(1).toBe(1)
  }
})
```

Examples of **correct** code for this rule:

```ts
test('foo', () => {
  expect(1).toBe(1)
})
```
