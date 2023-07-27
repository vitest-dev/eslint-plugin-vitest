# Prefer strict equal over equal (`vitest/prefer-strict-equal`)

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

<!-- end auto-generated rule header -->

```ts
// bad

expect(something).toEqual(somethingElse);

// good
expect(something).toStrictEqual(somethingElse);

```