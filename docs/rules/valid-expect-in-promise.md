# valid-expect-in-promise

⚠️ This rule _warns_ in the 🔵 `legacy-all` config.

<!-- end auto-generated rule header -->

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
