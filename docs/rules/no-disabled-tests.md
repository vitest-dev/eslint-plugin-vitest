# vitest/no-disabled-tests

📝 Disallow disabled tests.

⚠️ This rule _warns_ in the following configs: 🌐 `all`, ✅ `recommended`.

<!-- end auto-generated rule header -->

## Rule Details

This rule disallows disabled tests, and points at `.todo` for a test you do not want to run yet.

Vitest counts both in its summary (`1 skipped | 1 todo`), but they say different things. A skipped test keeps a body that nothing ever runs, so it quietly drifts out of step with the code it was written against while still reading like coverage the suite has. `.todo` takes no body and states plainly that the test is outstanding work, which is why this rule's message suggests it.

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
