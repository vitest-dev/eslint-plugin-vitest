# Ensure that every `expect.poll` call is awaited (`vitest/require-awaited-expect-poll`)

<!-- end auto-generated rule header -->

### Rule Details

This rule ensures that promises returned by `expect.poll` & `expect.element` calls are handled properly.

Examples of **incorrect** code for this rule:

```js
test('element exists', () => {
  asyncInjectElement()

  expect.poll(() => document.querySelector('.element')).toBeInTheDocument()
})
```

Examples of **correct** code for this rule:

```js
test('element exists', async () => {
  asyncInjectElement()

  await expect
    .poll(() => document.querySelector('.element'))
    .toBeInTheDocument()
})
```

```js
test('element exists', () => {
  asyncInjectElement()

  return expect
    .poll(() => document.querySelector('.element'))
    .toBeInTheDocument()
})
```
