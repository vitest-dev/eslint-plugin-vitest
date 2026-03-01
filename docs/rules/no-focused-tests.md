# vitest/no-focused-tests

📝 Disallow focused tests.

💼⚠️ This rule is enabled in the ✅ `recommended` config. This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

Examples of **incorrect** code for this rule:

```js
it.only('test', () => {
  // ...
})

test.only('it', () => {
  // ...
})
```

Examples of **correct** code for this rule:

```js
it('test', () => {
  // ...
})

test('it', () => {
  /* ... */
})
```

### Options

<!-- begin auto-generated rule options list -->

| Name      | Description                                 | Type    |
| :-------- | :------------------------------------------ | :------ |
| `fixable` | Whether the rule should provide an autofix. | Boolean |

<!-- end auto-generated rule options list -->

This rule has a `fixable` option that tells the plugin to automatically fix the tests for you. The option is enabled by default. You can disable it in your `eslint.config.js` file using the following configuration.

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
      'vitest/no-focused-tests': ['error', { fixable: false }],
    },
  },
]
```
