# Suggest using `expect().resolves` over `expect(await ...)` syntax (`vitest/prefer-expect-resolves`)

<<<<<<< HEAD
⚠️ This rule _warns_ in the 🌐 `all` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

```ts
// bad 
it('passes', async () => { expect(await someValue()).toBe(true); });

// good 
it('passes', async () => { await expect(someValue()).resolves.toBe(true); });
```
```