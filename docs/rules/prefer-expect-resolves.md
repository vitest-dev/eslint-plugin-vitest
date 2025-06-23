# prefer-expect-resolves

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

```ts
// bad
it('passes', async () => {
  expect(await someValue()).toBe(true)
})

// good
it('passes', async () => {
  await expect(someValue()).resolves.toBe(true)
})
```
