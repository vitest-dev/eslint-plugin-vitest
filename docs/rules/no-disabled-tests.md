# vitest/no-disabled-tests

📝 Disallow disabled tests.

⚠️ This rule _warns_ in the following configs: 🌐 `all`, ✅ `recommended`.

<!-- end auto-generated rule header -->

## Rule Details

This rule disallows disabled tests, and points at `.todo` for a test you do not want to run yet.

Vitest counts both in its summary (`1 skipped | 1 todo`), but they say different things. A skipped test keeps a body that nothing ever runs, so it quietly drifts out of step with the code it was written against while still reading like coverage the suite has. `.todo` takes no body and states plainly that the test is outstanding work, which is why this rule's message suggests it.

The rule reports:

- `.skip` on a suite or a test, written as a member (`describe.skip`, `test.skip`) or as an option (`test('foo', { skip: true }, fn)`)
- the `x`-prefixed aliases `xdescribe`, `xit` and `xtest`
- a test with a title but no callback. Vitest already treats this as a todo, so the rule asks you to say so with `.todo`
- a call to `pending()`, which is not a Vitest API. It is reported unless `pending` resolves to something in scope, such as your own import

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
