# Suggest using `toBeCalledWith()` or `toHaveBeenCalledWith()` (`vitest/prefer-called-with`)

<<<<<<< HEAD
⚠️ This rule _warns_ in the 🌐 `all` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

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