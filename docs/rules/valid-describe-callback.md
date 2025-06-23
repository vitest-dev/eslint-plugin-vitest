# valid-describe-callback

<!-- end auto-generated rule header -->

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
