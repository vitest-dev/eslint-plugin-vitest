# Prefer dynamic import in mock (`vitest/prefer-import-in-mock`)

⚠️ This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule enforces using a dynamic import() in vi.mock(), which improves type information and IntelliSense for the mocked module.

### Rule details

The following pattern is considered a warning:

```js
vi.mock('./path/to/module')
```

The following pattern is not considered a warning:

```js
vi.mock(import('./path/to/module'))
```
