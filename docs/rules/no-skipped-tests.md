# Disallow skipped tests (`vitest/no-skipped-tests`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

Examples of **incorrect** code for this rule:

```js
it.skip("test", () => {
  /* ... */
});

test.skip("it", () => {
  /* ... */
});
```

Examples of **correct** code for this rule:

```js
it("test", () => {
  /* ... */
});

test("it", () => {
  /* ... */
});
```
