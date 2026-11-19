# vitest/no-disabled-tests

📝 Disallow disabled tests.

⚠️ This rule _warns_ in the following configs: 🌐 `all`, ✅ `recommended`.

<!-- end auto-generated rule header -->

## Rationale

Skipped tests do not run, so the behavior they cover is no longer checked, and they tend to stay skipped long after the original reason is gone. Reporting them keeps disabled tests visible so they get fixed or removed.

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
