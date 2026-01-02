# vitest/no-unneeded-async-expect-function

📝 Disallow unnecessary async function wrapper for expected promises.

💼⚠️ This rule is enabled in the ✅ `recommended` config. This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

Disallow wrapping `expect` calls with unnecessary `async` functions when the awaited call can be passed directly. If the only statement inside the `async` wrapper is `await someCall()`, pass `someCall()` straight to `expect` instead.

Examples of **incorrect** code for this rule:

```js
it('wrong1', async () => {
  await expect(async () => {
    await doSomethingAsync()
  }).rejects.toThrow()
})

it('wrong2', async () => {
  await expect(async function () {
    await doSomethingAsync()
  }).rejects.toThrow()
})

it('wrong3', async () => {
  await expect(async () => await doSomethingAsync()).rejects.toThrow()
})
```

Examples of **correct** code for this rule

```js
it('right1', async () => {
  await expect(doSomethingAsync()).rejects.toThrow()
})
```
