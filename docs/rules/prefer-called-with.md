# vitest/prefer-called-with

📝 Enforce using `toBeCalledWith()` or `toHaveBeenCalledWith()`.

⚠️ This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to enforce the use of `toBeCalledWith()` or `toHaveBeenCalledWith()` over `toBeCalled()` or `toHaveBeenCalled()`, and `toHaveBeenCalledExactlyOnceWith()` over `toHaveBeenCalledOnce()`.

Examples of **incorrect** code for this rule:

```ts
test('foo', () => {
  const mock = vi.fn()
  mock('foo')
  expect(mock).toBeCalled()
  expect(mock).toHaveBeenCalled()
  expect(mock).toHaveBeenCalledOnce()
})
```

Examples of **correct** code for this rule:

```ts
test('foo', () => {
  const mock = vi.fn()
  mock('foo')
  expect(mock).toBeCalledWith('foo')
  expect(mock).toHaveBeenCalledWith('foo')
  expect(mock).toHaveBeenCalledExactlyOnceWith('foo')
})
```
