# Enforce unbound methods are called with their expected scope (`vitest/unbound-method`)

⚠️ This rule _warns_ in the 🌐 `all` config.

💭 This rule requires type information.

<!-- end auto-generated rule header -->

This rule extends the base [`@typescript-eslint/unbound-method`][https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/unbound-method.md]
rule, meaning you must depend on `@typescript-eslint/eslint-plugin` for it to
work. It adds support for understanding when it's ok to pass an unbound method
to `expect` calls.

### How to use this rule

This rule is enabled in the `all` config.


```json5
{
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['test/**'],
      plugins: ['vitest'],
      rules: {
        '@typescript-eslint/unbound-method': 'off',
        'vitest/unbound-method': 'error',
      },
    },
  ],
  rules: {
    '@typescript-eslint/unbound-method': 'error',
  },
}
```

### Options 

Checkout [@typescript-eslint/unbound-method](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/unbound-method.md)  options. including  `ignoreStatic`
