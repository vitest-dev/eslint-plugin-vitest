# Prefer mock resolved/rejected shorthands for promises (`vitest/prefer-mock-promise-shorthand`)

<<<<<<< HEAD
⚠️ This rule _warns_ in the 🌐 `all` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
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
