# vitest/prefer-import-in-mock

📝 Prefer dynamic import in mock.

⚠️ This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule enforces using a dynamic `import()` in `vi.mock()` and `vi.doMock()`, which improves type information and IntelliSense for the mocked module.

### Rule details

The following patterns are considered a warning:

```js
vi.mock('./path/to/module')
vi.doMock('./path/to/module')
```

The following patterns are not considered a warning:

```js
vi.mock(import('./path/to/module'))
vi.doMock(import('./path/to/module'))
```

### Options

<!-- begin auto-generated rule options list -->

| Name      | Description                                 | Type    | Default |
| :-------- | :------------------------------------------ | :------ | :------ |
| `fixable` | Whether the rule should provide an autofix. | Boolean | `true`  |

<!-- end auto-generated rule options list -->

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
