# Enforce strict equal over equal (`vitest/prefer-strict-equal`)

⚠️ This rule _warns_ in the 🌐 `all` config.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

```ts
// bad

expect(something).toEqual(somethingElse)

// good
expect(something).toStrictEqual(somethingElse)
```
