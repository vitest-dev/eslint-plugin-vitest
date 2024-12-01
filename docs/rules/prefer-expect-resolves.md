# Enforce using `expect().resolves` over `expect(await ...)` syntax (`vitest/prefer-expect-resolves`)

⚠️ This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

```ts
// bad 
it('passes', async () => { expect(await someValue()).toBe(true); });

// good 
it('passes', async () => { await expect(someValue()).resolves.toBe(true); });
```
