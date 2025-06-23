## eslint-plugin-vitest

![npm](https://img.shields.io/npm/v/@vitest/eslint-plugin)
[![ci](https://github.com/vitest-dev/eslint-plugin-vitest/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/veritem/eslint-plugin-vitest/actions/workflows/ci.yml)

ESLint plugin for Vitest

### Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `@vitest/eslint-plugin`

```sh
npm install @vitest/eslint-plugin --save-dev
```

### Usage

Make sure you're running ESLint `v9.0.0` or higher for the latest version of this plugin to work. The following example is how your `eslint.config.js` should be setup for this plugin to work for you.

```js
import vitest from '@vitest/eslint-plugin'

export default [
  {
    files: ['tests/**'], // or any other pattern
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules, // you can also use vitest.configs.all.rules to enable all rules
      'vitest/max-nested-describe': ['error', { max: 3 }], // you can also modify rules' behavior using option like this
    },
  },
]
```

If you're not using the latest version of ESLint (version `v8.57.0` or lower) you can setup this plugin using the following configuration

Add `vitest` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["@vitest"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "@vitest/max-nested-describe": [
      "error",
      {
        "max": 3
      }
    ]
  }
}
```

If you're using old ESLint configuration, make sure to use legacy key like the following

```js
{
  "extends": ["plugin:@vitest/legacy-recommended"] // or legacy-all
}
```

#### Enabling with type-testing

Vitest ships with an optional [type-testing feature](https://vitest.dev/guide/testing-types), which is disabled by default.

If you're using this feature, you should also enabled `typecheck` in the settings for this plugin. This ensures that rules like [expect-expect](docs/rules/expect-expect.md) account for type-related assertions in tests.

```js
import vitest from '@vitest/eslint-plugin'

export default [
  {
    files: ['tests/**'], // or any other pattern
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },
]
```

### Shareable configurations

#### Recommended

This plugin exports a recommended configuration that enforces good testing practices.

To enable this configuration with `eslint.config.js`, use `vitest.configs.recommended`:

```js
import vitest from '@vitest/eslint-plugin'

export default [
  {
    files: ['tests/**'], // or any other pattern
    ...vitest.configs.recommended,
  },
]
```

#### All

If you want to enable all rules instead of only some you can do so by adding the all configuration to your `eslint.config.js` config file:

```js
import vitest from '@vitest/eslint-plugin'

export default [
  {
    files: ['tests/**'], // or any other pattern
    ...vitest.configs.all,
  },
]
```

### Rules

<!-- begin auto-generated rules list -->

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).\
💭 Requires [type information](https://typescript-eslint.io/linting/typed-linting).\
❌ Deprecated.

| Name                                                                                                                     | Description                                                                             | 🔧  | 💡  | 💭  | ❌  |
| :----------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- | :-- | :-- | :-- | :-- |
| [consistent-test-filename](docs/rules/consistent-test-filename.md)                                                       | require .spec test file pattern                                                         |     |     |     |     |
| [consistent-test-it](docs/rules/consistent-test-it.md)                                                                   | enforce using test or it but not both                                                   | 🔧  |     |     |     |
| [consistent-vitest-vi](docs/rules/consistent-vitest-vi.md)                                                               | enforce using vitest or vi but not both                                                 | 🔧  |     |     |     |
| [expect-expect](docs/rules/expect-expect.md)                                                                             | enforce having expectation in test body                                                 |     |     |     |     |
| [max-expects](docs/rules/max-expects.md)                                                                                 | enforce a maximum number of expect per test                                             |     |     |     |     |
| [max-nested-describe](docs/rules/max-nested-describe.md)                                                                 | require describe block to be less than set max value or default value                   |     |     |     |     |
| [no-alias-methods](docs/rules/no-alias-methods.md)                                                                       | disallow alias methods                                                                  | 🔧  |     |     |     |
| [no-commented-out-tests](docs/rules/no-commented-out-tests.md)                                                           | disallow commented out tests                                                            |     |     |     |     |
| [no-conditional-expect](docs/rules/no-conditional-expect.md)                                                             | disallow conditional expects                                                            |     |     |     |     |
| [no-conditional-in-test](docs/rules/no-conditional-in-test.md)                                                           | disallow conditional tests                                                              |     |     |     |     |
| [no-conditional-tests](docs/rules/no-conditional-tests.md)                                                               | disallow conditional tests                                                              |     |     |     |     |
| [no-disabled-tests](docs/rules/no-disabled-tests.md)                                                                     | disallow disabled tests                                                                 |     |     |     |     |
| [no-done-callback](docs/rules/no-done-callback.md)                                                                       | disallow using a callback in asynchronous tests and hooks                               |     | 💡  |     | ❌  |
| [no-duplicate-hooks](docs/rules/no-duplicate-hooks.md)                                                                   | disallow duplicate hooks and teardown hooks                                             |     |     |     |     |
| [no-focused-tests](docs/rules/no-focused-tests.md)                                                                       | disallow focused tests                                                                  | 🔧  |     |     |     |
| [no-hooks](docs/rules/no-hooks.md)                                                                                       | disallow setup and teardown hooks                                                       |     |     |     |     |
| [no-identical-title](docs/rules/no-identical-title.md)                                                                   | disallow identical titles                                                               | 🔧  |     |     |     |
| [no-import-node-test](docs/rules/no-import-node-test.md)                                                                 | disallow importing `node:test`                                                          | 🔧  |     |     |     |
| [no-importing-vitest-globals](docs/rules/no-importing-vitest-globals.md)                                                 | disallow importing Vitest globals                                                       | 🔧  |     |     |     |
| [no-interpolation-in-snapshots](docs/rules/no-interpolation-in-snapshots.md)                                             | disallow string interpolation in snapshots                                              | 🔧  |     |     |     |
| [no-large-snapshots](docs/rules/no-large-snapshots.md)                                                                   | disallow large snapshots                                                                |     |     |     |     |
| [no-mocks-import](docs/rules/no-mocks-import.md)                                                                         | disallow importing from **mocks** directory                                             |     |     |     |     |
| [no-restricted-matchers](docs/rules/no-restricted-matchers.md)                                                           | disallow the use of certain matchers                                                    |     |     |     |     |
| [no-restricted-vi-methods](docs/rules/no-restricted-vi-methods.md)                                                       | disallow specific `vi.` methods                                                         |     |     |     |     |
| [no-standalone-expect](docs/rules/no-standalone-expect.md)                                                               | disallow using `expect` outside of `it` or `test` blocks                                |     |     |     |     |
| [no-test-prefixes](docs/rules/no-test-prefixes.md)                                                                       | disallow using the `f` and `x` prefixes in favour of `.only` and `.skip`                | 🔧  |     |     |     |
| [no-test-return-statement](docs/rules/no-test-return-statement.md)                                                       | disallow return statements in tests                                                     |     |     |     |     |
| [padding-around-after-all-blocks](docs/rules/padding-around-after-all-blocks.md)                                         | Enforce padding around `afterAll` blocks                                                | 🔧  |     |     |     |
| [padding-around-after-each-blocks](docs/rules/padding-around-after-each-blocks.md)                                       | Enforce padding around `afterEach` blocks                                               | 🔧  |     |     |     |
| [padding-around-all](docs/rules/padding-around-all.md)                                                                   | Enforce padding around vitest functions                                                 | 🔧  |     |     |     |
| [padding-around-before-all-blocks](docs/rules/padding-around-before-all-blocks.md)                                       | Enforce padding around `beforeAll` blocks                                               | 🔧  |     |     |     |
| [padding-around-before-each-blocks](docs/rules/padding-around-before-each-blocks.md)                                     | Enforce padding around `beforeEach` blocks                                              | 🔧  |     |     |     |
| [padding-around-describe-blocks](docs/rules/padding-around-describe-blocks.md)                                           | Enforce padding around `describe` blocks                                                | 🔧  |     |     |     |
| [padding-around-expect-groups](docs/rules/padding-around-expect-groups.md)                                               | Enforce padding around `expect` groups                                                  | 🔧  |     |     |     |
| [padding-around-test-blocks](docs/rules/padding-around-test-blocks.md)                                                   | Enforce padding around `test` blocks                                                    | 🔧  |     |     |     |
| [prefer-called-times](docs/rules/prefer-called-times.md)                                                                 | enforce using `toBeCalledTimes(1)` or `toHaveBeenCalledTimes(1)`                        | 🔧  |     |     |     |
| [prefer-called-with](docs/rules/prefer-called-with.md)                                                                   | enforce using `toBeCalledWith()` or `toHaveBeenCalledWith()`                            | 🔧  |     |     |     |
| [prefer-comparison-matcher](docs/rules/prefer-comparison-matcher.md)                                                     | enforce using the built-in comparison matchers                                          | 🔧  |     |     |     |
| [prefer-describe-function-title](docs/rules/prefer-describe-function-title.md)                                           | enforce using a function as a describe title over an equivalent string                  | 🔧  |     |     |     |
| [prefer-each](docs/rules/prefer-each.md)                                                                                 | enforce using `each` rather than manual loops                                           |     |     |     |     |
| [prefer-equality-matcher](docs/rules/prefer-equality-matcher.md)                                                         | enforce using the built-in quality matchers                                             |     | 💡  |     |     |
| [prefer-expect-assertions](docs/rules/prefer-expect-assertions.md)                                                       | enforce using expect assertions instead of callbacks                                    |     | 💡  |     |     |
| [prefer-expect-resolves](docs/rules/prefer-expect-resolves.md)                                                           | enforce using `expect().resolves` over `expect(await ...)` syntax                       | 🔧  |     |     |     |
| [prefer-hooks-in-order](docs/rules/prefer-hooks-in-order.md)                                                             | enforce having hooks in consistent order                                                |     |     |     |     |
| [prefer-hooks-on-top](docs/rules/prefer-hooks-on-top.md)                                                                 | enforce having hooks before any test cases                                              |     |     |     |     |
| [prefer-importing-vitest-globals](docs/rules/prefer-importing-vitest-globals.md)                                         | enforce importing Vitest globals                                                        | 🔧  |     |     |     |
| [prefer-lowercase-title](docs/rules/prefer-lowercase-title.md)                                                           | enforce lowercase titles                                                                | 🔧  |     |     |     |
| [prefer-mock-promise-shorthand](docs/rules/prefer-mock-promise-shorthand.md)                                             | enforce mock resolved/rejected shorthands for promises                                  | 🔧  |     |     |     |
| [prefer-snapshot-hint](docs/rules/prefer-snapshot-hint.md)                                                               | enforce including a hint with external snapshots                                        |     |     |     |     |
| [prefer-spy-on](docs/rules/prefer-spy-on.md)                                                                             | enforce using `vi.spyOn`                                                                | 🔧  |     |     |     |
| [prefer-strict-boolean-matchers](docs/rules/prefer-strict-boolean-matchers.md)                                           | enforce using `toBe(true)` and `toBe(false)` over matchers that coerce types to boolean | 🔧  |     |     |     |
| [prefer-strict-equal](docs/rules/prefer-strict-equal.md)                                                                 | enforce strict equal over equal                                                         |     | 💡  |     |     |
| [prefer-to-be](docs/rules/prefer-to-be.md)                                                                               | enforce using toBe()                                                                    | 🔧  |     |     |     |
| [prefer-to-be-falsy](docs/rules/prefer-to-be-falsy.md)                                                                   | enforce using toBeFalsy()                                                               | 🔧  |     |     |     |
| [prefer-to-be-object](docs/rules/prefer-to-be-object.md)                                                                 | enforce using toBeObject()                                                              | 🔧  |     |     |     |
| [prefer-to-be-truthy](docs/rules/prefer-to-be-truthy.md)                                                                 | enforce using `toBeTruthy`                                                              | 🔧  |     |     |     |
| [prefer-to-contain](docs/rules/prefer-to-contain.md)                                                                     | enforce using toContain()                                                               | 🔧  |     |     |     |
| [prefer-to-have-length](docs/rules/prefer-to-have-length.md)                                                             | enforce using toHaveLength()                                                            | 🔧  |     |     |     |
| [prefer-todo](docs/rules/prefer-todo.md)                                                                                 | enforce using `test.todo`                                                               | 🔧  |     |     |     |
| [prefer-vi-mocked](docs/rules/prefer-vi-mocked.md)                                                                       | require `vi.mocked()` over `fn as Mock`                                                 | 🔧  |     | 💭  |     |
| [require-hook](docs/rules/require-hook.md)                                                                               | require setup and teardown to be within a hook                                          |     |     |     |     |
| [require-local-test-context-for-concurrent-snapshots](docs/rules/require-local-test-context-for-concurrent-snapshots.md) | require local Test Context for concurrent snapshot tests                                |     |     |     |     |
| [require-mock-type-parameters](docs/rules/require-mock-type-parameters.md)                                               | enforce using type parameters with vitest mock functions                                | 🔧  |     |     |     |
| [require-to-throw-message](docs/rules/require-to-throw-message.md)                                                       | require toThrow() to be called with an error message                                    |     |     |     |     |
| [require-top-level-describe](docs/rules/require-top-level-describe.md)                                                   | enforce that all tests are in a top-level describe                                      |     |     |     |     |
| [valid-describe-callback](docs/rules/valid-describe-callback.md)                                                         | enforce valid describe callback                                                         |     |     |     |     |
| [valid-expect](docs/rules/valid-expect.md)                                                                               | enforce valid `expect()` usage                                                          | 🔧  |     |     |     |
| [valid-expect-in-promise](docs/rules/valid-expect-in-promise.md)                                                         | require promises that have expectations in their chain to be valid                      |     |     |     |     |
| [valid-title](docs/rules/valid-title.md)                                                                                 | enforce valid titles                                                                    | 🔧  |     |     |     |

<!-- end auto-generated rules list -->

#### Credits

- [eslint-plugin-jest](https://github.com/jest-community/eslint-plugin-jest)
  Most of the rules in this plugin are essentially ports of Jest plugin rules with minor modifications

### Licence

[MIT](https://github.com/veritem/eslint-plugin-vitest/blob/main/LICENSE) Licence &copy; 2022 - present [veritem](https://github.com/veritem) and contributors
