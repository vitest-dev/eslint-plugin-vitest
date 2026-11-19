# vitest/valid-expect-in-promise

📝 Require promises that have expectations in their chain to be valid.

💼⚠️ This rule is enabled in the ✅ `recommended` config. This rule _warns_ in the 🌐 `all` config.

<!-- end auto-generated rule header -->

## Rationale

If a promise containing `expect` calls is neither awaited nor returned, the test can finish before the promise settles. The assertions then run too late to fail the test, or not at all, so the test passes even when the expectations are wrong.

This rule flags any promises within the body of a test that include expectations that have either not been returned or awaited.

The following patterns is considered warning:

```js
test('promise test', async () => {
  something().then((value) => {
    expect(value).toBe('red')
  })
})

test('promises test', () => {
  const onePromise = something().then((value) => {
    expect(value).toBe('red')
  })
  const twoPromise = something().then((value) => {
    expect(value).toBe('blue')
  })

  return Promise.any([onePromise, twoPromise])
})
```

The following pattern is not warning:

```js
test('promise test', async () => {
  await something().then((value) => {
    expect(value).toBe('red')
  })
})

test('promises test', () => {
  const onePromise = something().then((value) => {
    expect(value).toBe('red')
  })
  const twoPromise = something().then((value) => {
    expect(value).toBe('blue')
  })

  return Promise.all([onePromise, twoPromise])
})
```
