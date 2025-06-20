# Enforce using `toBeCalledOnce()` or `toHaveBeenCalledOnce()` (`vitest/prefer-called-once`)



## Rule Details

This rule aims to enforce the use of `toBeCalledOnce()` or `toHaveBeenCalledOnce()` over `toBeCalledTimes(1)` or `toHaveBeenCalledTimes(1)`.

Examples of **incorrect** code for this rule:

```ts
test('foo', () => {
  const mock = vi.fn()
  mock('foo')
  expect(mock).toBeCalledTimes(1)
  expect(mock).toHaveBeenCalledTimes(1)
})
```

Examples of **correct** code for this rule:

```ts
test('foo', () => {
  const mock = vi.fn()
  mock('foo')
  expect(mock).toBeCalledOnce()
  expect(mock).toHaveBeenCalledOnce()
})
```
