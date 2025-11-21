# Require usage of import in vi.mock() (`vitest/require-import-vi-mock`)

⚠️ This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule enforce usage of `import` inside `vi.mock` usage

Examples of **incorrect** code for this rule:

```js
vi.mock('./foo.js')
```

Examples of **correct** code for this rule:

```js
vi.mock(import('./foo.js'))
vi.mock(import('./foo.js'), { spy: true })
vi.mock(import('./foo.js'), () => ({
  Foo: vi.fn(),
}))
```
