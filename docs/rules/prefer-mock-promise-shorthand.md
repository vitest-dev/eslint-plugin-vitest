# vitest/prefer-mock-promise-shorthand

📝 Enforce mock resolved/rejected shorthands for promises.

⚠️ This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

```ts
// bad
vi.fn().mockReturnValue(Promise.reject(42))
vi.fn().mockImplementation(() => Promise.resolve(42))

// good
vi.fn().mockRejectedValue(42)
vi.fn().mockResolvedValue(42)
```

For `mockImplementation`, the autofix only applies when the promise value is a
literal or an identifier, because any other expression would be evaluated once
instead of on every call.
