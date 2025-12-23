# Prefer mock return shorthands (`vitest/prefer-mock-return-shorthand`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

```js
// bad
vi.fn().mockImplementation(() => 'hello world')

vi.spyOn(fs.promises, 'readFile').mockImplementationOnce(() =>
  Promise.reject(new Error('oh noes!')),
)

myFunction
  .mockImplementationOnce(() => 42)
  .mockImplementationOnce(() => Promise.resolve(42))
  .mockReturnValue(0)

// good
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
