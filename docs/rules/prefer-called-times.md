# Enforce using `toBeCalledTimes(1)` or `toHaveBeenCalledTimes(1)` (`@vitest/prefer-called-times`)

⚠️ This rule _warns_ in the `legacy-all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to enforce the use of `toBeCalledTimes(1)` or `toHaveBeenCalledTimes(1)` over `toBeCalledOnce()` or `toHaveBeenCalledOnce()`.

Examples of **incorrect** code for this rule:

```ts
test('foo', () => {
    const mock = vi.fn()
    mock('foo')
    expect(mock).toBeCalledOnce()
    expect(mock).toHaveBeenCalledOnce()
})
```

Examples of **correct** code for this rule:

```ts
test('foo', () => {
  const mock = vi.fn()
  mock('foo')
  expect(mock).toBeCalledTimes(1)
  expect(mock).toHaveBeenCalledTimes(1)
})
```
