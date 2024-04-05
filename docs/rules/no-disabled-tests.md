# Disallow disabled tests (`vitest/no-disabled-tests`)

⚠️ This rule _warns_ in the `all-legacy` config.

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
