# vitest/prefer-mock-return-shorthand

📝 Prefer mock return shorthands.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

When working with mocks of functions that return simple values, vitest provides
some API sugar functions to reduce the amount of boilerplate you have to write.

These methods should be preferred when possible.

The following patterns are **warnings**

```js
vi.fn().mockImplementation(() => 'hello world')

vi.spyOn(fs.promises, 'readFile').mockImplementationOnce(() =>
  Promise.reject(new Error('oh noes!')),
)

myFunction
  .mockImplementationOnce(() => 42)
  .mockImplementationOnce(() => Promise.resolve(42))
  .mockReturnValue(0)
```

The following patterns are not **warnings**

```js
vi.fn().mockResolvedValue(123)

vi.spyOn(fs.promises, 'readFile').mockReturnValue(
  Promise.reject(new Error('oh noes!')),
)
vi.spyOn(fs.promises, 'readFile').mockRejectedValue(new Error('oh noes!'))

vi.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
  throw new Error('oh noes!')
})

myFunction
  .mockResolvedValueOnce(42)
  .mockResolvedValueOnce(42)
  .mockReturnValue(0)
```
