# Enforce having expectation in test body (`vitest/expect-expect`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

Examples of **incorrect** code for this rule:

```js
test("myLogic", () => {
  const actual = myLogic();
});
```

Examples of **correct** code for this rule:

```js
test("myLogic", () => {
  const actual = myLogic();
  expect(actual).toBe(true);
});
```
