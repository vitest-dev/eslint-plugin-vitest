# Require tests to declare a timeout (`vitest/require-test-timeout`)

🚫 This rule is _disabled_ in the 🌐 `all` config.

<!-- end auto-generated rule header -->

This rule ensures tests explicitly declare a timeout so long-running tests don't hang silently.

```ts
// bad
it('slow test', async () => {
  await doSomethingSlow()
})

// good (numeric timeout)
test('slow test', async () => {
  await doSomethingSlow()
}, 1000)

// good (options object)
test('slow test', { timeout: 1000 }, async () => {
  await doSomethingSlow()
})

// good (file-level)
vi.setConfig({ testTimeout: 1000 })

test('slow test', async () => {
  await doSomethingSlow()
})
```
