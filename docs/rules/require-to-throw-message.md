# Require toThrow() to be called with an error message (`vitest/require-to-throw-message`)

<<<<<<< HEAD
⚠️ This rule _warns_ in the 🌐 `all` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
<!-- end auto-generated rule header -->

This rule triggers a warning if `toThrow()` or `toThrowError()` is used without
an error message.

The following patterns are considered warnings:

```js
test('foo', () => {
  expect(() => {
	throw new Error('foo')
  }).toThrow()
})

test('foo', () => {
  expect(() => {
	throw new Error('foo')
  }).toThrowError()
})
```

The following patterns are not considered warnings:

```js
test('foo', () => {
  expect(() => {
	throw new Error('foo')
  }).toThrow('foo')
})

test('foo', () => {
  expect(() => {
	throw new Error('foo')
  }).toThrowError('foo')
})
```