# Suggest using the built-in quality matchers (`vitest/prefer-equality-matcher`)

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to enforce the use of the built-in equality matchers.

Examples of **incorrect** code for this rule:

```ts
 // bad 
  expect(1 == 1).toBe(1)
  

 // bad
  expect(1).toEqual(1)

```