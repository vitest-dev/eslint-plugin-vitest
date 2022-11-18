# Enforce lowercase titles (`vitest/lower-case-title`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

Examples of **incorrect** code for this rule:

```js
test("IT WORKS", () => {
  // ...
});
```

Examples of **correct** code for this rule:

```js
test("it works", () => {
  // ...
});
```
