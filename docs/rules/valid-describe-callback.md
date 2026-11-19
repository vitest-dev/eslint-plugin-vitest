# vitest/valid-describe-callback

📝 Enforce valid describe callback.

💼⚠️ This rule is enabled in the ✅ `recommended` config. This rule _warns_ in the 🌐 `all` config.

<!-- end auto-generated rule header -->

## Rationale

A `describe` callback only groups tests and hooks. Parameters such as `done` and `return` statements usually mean the callback was written like a test, and a missing or non-function callback means the suite does not register the tests the author intended. Catching these early avoids suites that silently test less than expected.

## Rule Details

This rule validates the second parameter of a `describe()` function is a callback.

- should not contain parameters
- should not contain any `return` statements

The following are considered warnings:

```js
// callback function parameters are not allowed
describe('myfunc', (done) => {
  //
})

describe('myfunc', () => {
  // no return statements are allowed in a block of a callback function
  return Promise.resolve().then(() => {
    //
  })
})

// returning a value from a describe block is not allowed
describe('myfunc', () =>
  it('should do something', () => {
    //
  }))
```

The following are not considered warnings:

```js
describe('myfunc', async () => {
  //
})
describe('myfunc', () => {
  it('should do something', () => {
    //
  })
})
```
