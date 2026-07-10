# vitest/prefer-expect-assertions

📝 Enforce using expect assertions instead of callbacks.

⚠️ This rule _warns_ in the 🌐 `all` config.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

Ensure every test to have either `expect.assertions(<number of assertions>)` OR
`expect.hasAssertions()` as its first expression.

This will warn if a test has no assertions, or if it has assertions but they are not the first expression.

## Examples

Examples of **incorrect** code for this rule:

```js
test('no assertions', () => {
  // ...
})

test('assertions not first', () => {
  expect(true).toBe(true)
  // ...
})
```

Examples of **correct** code for this rule:

```js
test('assertions first', () => {
  expect.assertions(1)
  // ...
})

test('assertions first', () => {
  expect.hasAssertions()
  // ...
})
```

## Options

<!-- begin auto-generated rule options list -->

| Name                                | Description                                                                  | Type    |
| :---------------------------------- | :--------------------------------------------------------------------------- | :------ |
| `disallowHasAssertions`             | Warn when `expect.hasAssertions()` is used instead of `expect.assertions()`. | Boolean |
| `onlyFunctionsWithAsyncKeyword`     | Only check test functions declared with the async keyword.                   | Boolean |
| `onlyFunctionsWithExpectInCallback` | Only check test functions that contain `expect` in callbacks.                | Boolean |
| `onlyFunctionsWithExpectInLoop`     | Only check test functions that contain `expect` inside loops.                | Boolean |

<!-- end auto-generated rule options list -->

`onlyFunctionsWithAsyncKeyword` (default: `false`)

When `true`, only functions with the `async` keyword will be checked.

when this option is enabled the following code will be considered incorrect:

```js
test('assertions first', async () => {
  const data = await fetchData()
  expect(data).toBe('peanut butter')
})
```

To fix this, you'll need to add `expect.assertions(1)` or `expect.hasAssertions()` as the first expression:

```js
test('assertions first', async () => {
  expect.assertions(1)
  const data = await fetchData()
  expect(data).toBe('peanut butter')
})
```

`onlyFunctionsWithExpectInLoop` (default: `false`)

When `true`, only functions with `expect` in a loop will be checked.

when this option is enabled the following code will be considered incorrect:

```js
test('assertions first', () => {
  for (let i = 0; i < 10; i++) {
    expect(i).toBeLessThan(10)
  }
})
```

To fix this, you'll need to add `expect.assertions(1)` or `expect.hasAssertions()` as the first expression:

```js
test('assertions first', () => {
  expect.hasAssertions()
  for (let i = 0; i < 10; i++) {
    expect(i).toBeLessThan(10)
  }
})
```

`onlyFunctionsWithExpectInCallback`

When `true`, only functions with `expect` in a callback will be checked.

when this option is enabled the following code will be considered incorrect:

```js
test('assertions first', () => {
  fetchData((data) => {
    expect(data).toBe('peanut butter')
  })
})
```

To fix this, you'll need to add `expect.assertions(1)` or `expect.hasAssertions()` as the first expression:

```js
test('assertions first', () => {
  expect.assertions(1)
  fetchData((data) => {
    expect(data).toBe('peanut butter')
  })
})
```

`disallowHasAssertions` (default: `false`)

When `true`, `expect.hasAssertions()` will be reported in favor of `expect.assertions()`.
Suggestions for missing assertions will only include `expect.assertions()`.

when this option is enabled the following code will be considered incorrect:

```js
test('has assertions', () => {
  expect.hasAssertions()
  expect(value).toBe(1)
})
```

To fix this, use `expect.assertions(<number of assertions>)` instead:

```js
test('has assertions', () => {
  expect.assertions(1)
  expect(value).toBe(1)
})
```
