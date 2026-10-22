# vitest/no-mock-implementation-throw

📝 Disallow mock implementations that only throw.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Since Vitest 4.1, `mockThrow` and `mockThrowOnce` are available for mocks that
should throw, which removes the boilerplate of writing an implementation whose
only job is to throw.

These methods should be preferred when possible.

> [!NOTE]
> This rule requires Vitest 4.1 or later, as that is when `mockThrow` and
> `mockThrowOnce` were introduced.

The following patterns are **warnings**

```js
vi.fn().mockImplementation(() => {
  throw new Error('oh noes!')
})

vi.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
  throw new Error('oh noes!')
})

myFunction.mockImplementation(function () {
  throw new TypeError('nope')
})
```

The following patterns are not **warnings**

```js
vi.fn().mockThrow(new Error('oh noes!'))

vi.spyOn(fs, 'readFileSync').mockThrowOnce(new Error('oh noes!'))

// an async function rejects rather than throws
vi.fn().mockImplementation(async () => {
  throw new Error('oh noes!')
})

// the implementation does more than throw
vi.fn().mockImplementation(() => {
  console.log('about to explode')

  throw new Error('oh noes!')
})

// the implementation only throws conditionally
vi.fn().mockImplementation(() => {
  if (someCondition) {
    throw new Error('oh noes!')
  }
})
```

## Caveats

The fix is not a perfectly equivalent transformation: an implementation creates
a new value on every call, whereas `mockThrow` evaluates its argument once and
throws that same value every time. This matters if you rely on the stack trace
of the thrown error pointing at the call site, or if you mutate the thrown
value between calls.
