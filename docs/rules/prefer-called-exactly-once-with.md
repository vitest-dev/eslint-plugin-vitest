# vitest/prefer-called-exactly-once-with

📝 Prefer `toHaveBeenCalledExactlyOnceWith` over `toHaveBeenCalledOnce` and `toHaveBeenCalledWith`.

💼⚠️ This rule is enabled in the ✅ `recommended` config. This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Examples of **incorrect** code for this rule:

```js
test('foo', () => {
  const mock = vi.fn()
  mock('foo')
  expect(mock).toHaveBeenCalledOnce()
  expect(mock).toHaveBeenCalledWith('foo')
})
```

```js
test('foo', () => {
  const mock = vi.fn()
  mock('foo')
  expect(mock).toHaveBeenCalledExactlyOnceWith('foo')
})
```
