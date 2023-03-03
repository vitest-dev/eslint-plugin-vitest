# Suggest using `toBeCalledWith()` or `toHaveBeenCalledWith()` (`vitest/prefer-called-with`)

⚠️ This rule _warns_ in the 🌐 `all` config.

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to enforce the use of `toBeCalledWith()` or `toHaveBeenCalledWith()` over `toBeCalled()` or `toHaveBeenCalled()`.

Examples of **incorrect** code for this rule:

```ts
test('foo', () => {
  const mock = jest.fn()
  mock('foo')
  expect(mock).toBeCalled()
  expect(mock).toHaveBeenCalled()
})
```

Examples of **correct** code for this rule:

```ts
test('foo', () => {
  const mock = jest.fn()
  mock('foo')
  expect(mock).toBeCalledWith('foo')
  expect(mock).toHaveBeenCalledWith('foo')
})
```