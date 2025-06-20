# Enforce using `toBeCalledTimes(1)` or `toHaveBeenCalledTimes(1)` (`vitest/prefer-called-times`)

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
