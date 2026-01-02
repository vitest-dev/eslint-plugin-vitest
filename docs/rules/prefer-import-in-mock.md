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

### Options

This rule has a `fixable` option that tells the plugin to automatically fix the imports for you.
The option is enabled by default. You can disable it in your `eslint.config.js` file using the following configuration.

```ts
import vitest from 'eslint-plugin-vitest'

export default [
  {
    files: ['**/*.ts', '**/*.js'], // or any other pattern
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.all,
      'vitest/prefer-import-in-mock': ['error', { fixable: false }],
    },
  },
]
```
