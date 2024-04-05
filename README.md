## eslint-plugin-vitest

![npm](https://img.shields.io/npm/v/eslint-plugin-vitest)
[![ci](https://github.com/veritem/eslint-plugin-vitest/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/veritem/eslint-plugin-vitest/actions/workflows/ci.yml)

Eslint plugin for vitest

### Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-vitest`:

```sh
npm install eslint-plugin-vitest --save-dev
```

### Usage

Add `vitest` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["vitest"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "vitest/max-nested-describe": [
      "error",
      {
        "max": 3
      }
    ]
  }
}
```

#### Recommended

To use the recommended configuration, extend it in your `.eslintrc` file:

```json
{
  "extends": ["plugin:vitest/recommended"]
}
```

All recommend rules will be set to error by default. You can however disable some rules by setting turning them `off` in your `.eslintrc` file or by setting them to `warn` in your `.eslintrc`.

#### all

To use the all configuration, extend it in your `.eslintrc` file:

```json
{
  "extends": ["plugin:vitest/all"]
}
```

#### Running on test files only

This plugin assumes that you're running it on tests files only by default which sometimes is not the case. If you can to run it on test files only. Your configuration will look like this:

If you're using `.eslintrc`

```json 
{
	"extends": ["eslint:recommended"],
	"overrides": [
		{
			"files": ["tests/**"], // or any other pattern
			"plugins": ["vitest"],
			"extends": ["plugin:vitest/recommended"]
		}
	]
}
```

If you're using `.eslintrc.js`

```js
import vitest from "eslint-plugin-vitest";

export default [
  {
    files: ["tests/**"], // or any other pattern
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },
];
```

#### Enabling with type-testing

Vitest ships with an optional [type-testing feature](https://vitest.dev/guide/testing-types), which is disabled by default.

If you're using this feature, you should also enabled `typecheck` in the settings for this plugin. This ensures that rules like [expect-expect](docs/rules/expect-expect.md) account for type-related assertions in tests.

```json
{
  "extends": ["plugin:vitest/recommended"],
  "settings" :{
    "vitest": {
      "typecheck": true,
    }
  }
}
```

### Rules

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
⚠️ Configurations set to warn in.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).\
❌ Deprecated.

| Name                                                                                                                     | Description                                                              | 💼                            | ⚠️                    | 🔧 | 💡 | ❌  |
| :----------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------- | :---------------------------- | :-------------------- | :- | :- | :- |
| [consistent-test-filename](docs/rules/consistent-test-filename.md)                                                       | forbidden .spec test file pattern                                        |                               | ![badge-all-legacy][] |    |    |    |
| [consistent-test-it](docs/rules/consistent-test-it.md)                                                                   | Prefer test or it but not both                                           |                               | ![badge-all-legacy][] | 🔧 |    |    |
| [expect-expect](docs/rules/expect-expect.md)                                                                             | Enforce having expectation in test body                                  | ![badge-recommended-legacy][] |                       |    |    |    |
| [max-expects](docs/rules/max-expects.md)                                                                                 | Enforce a maximum number of expect per test                              |                               | ![badge-all-legacy][] |    |    |    |
| [max-nested-describe](docs/rules/max-nested-describe.md)                                                                 | Nested describe block should be less than set max value or default value |                               | ![badge-all-legacy][] |    |    |    |
| [no-alias-methods](docs/rules/no-alias-methods.md)                                                                       | Disallow alias methods                                                   |                               | ![badge-all-legacy][] | 🔧 |    |    |
| [no-commented-out-tests](docs/rules/no-commented-out-tests.md)                                                           | Disallow commented out tests                                             | ![badge-recommended-legacy][] |                       |    |    |    |
| [no-conditional-expect](docs/rules/no-conditional-expect.md)                                                             | Disallow conditional expects                                             |                               | ![badge-all-legacy][] |    |    |    |
| [no-conditional-in-test](docs/rules/no-conditional-in-test.md)                                                           | Disallow conditional tests                                               |                               | ![badge-all-legacy][] |    |    |    |
| [no-conditional-tests](docs/rules/no-conditional-tests.md)                                                               | Disallow conditional tests                                               |                               | ![badge-all-legacy][] |    |    |    |
| [no-disabled-tests](docs/rules/no-disabled-tests.md)                                                                     | Disallow disabled tests                                                  |                               | ![badge-all-legacy][] |    |    |    |
| [no-done-callback](docs/rules/no-done-callback.md)                                                                       | Disallow using a callback in asynchronous tests and hooks                |                               | ![badge-all-legacy][] |    | 💡 | ❌  |
| [no-duplicate-hooks](docs/rules/no-duplicate-hooks.md)                                                                   | Disallow duplicate hooks and teardown hooks                              |                               | ![badge-all-legacy][] |    |    |    |
| [no-focused-tests](docs/rules/no-focused-tests.md)                                                                       | Disallow focused tests                                                   |                               | ![badge-all-legacy][] | 🔧 |    |    |
| [no-hooks](docs/rules/no-hooks.md)                                                                                       | Disallow setup and teardown hooks                                        |                               | ![badge-all-legacy][] |    |    |    |
| [no-identical-title](docs/rules/no-identical-title.md)                                                                   | Disallow identical titles                                                | ![badge-recommended-legacy][] |                       | 🔧 |    |    |
| [no-import-node-test](docs/rules/no-import-node-test.md)                                                                 | Disallow importing `node:test`                                           | ![badge-recommended-legacy][] |                       | 🔧 |    |    |
| [no-interpolation-in-snapshots](docs/rules/no-interpolation-in-snapshots.md)                                             | Disallow string interpolation in snapshots                               |                               | ![badge-all-legacy][] | 🔧 |    |    |
| [no-large-snapshots](docs/rules/no-large-snapshots.md)                                                                   | Disallow large snapshots                                                 |                               | ![badge-all-legacy][] |    |    |    |
| [no-mocks-import](docs/rules/no-mocks-import.md)                                                                         | Disallow importing from __mocks__ directory                              |                               | ![badge-all-legacy][] |    |    |    |
| [no-restricted-matchers](docs/rules/no-restricted-matchers.md)                                                           | Disallow the use of certain matchers                                     |                               | ![badge-all-legacy][] |    |    |    |
| [no-restricted-vi-methods](docs/rules/no-restricted-vi-methods.md)                                                       | Disallow specific `vi.` methods                                          |                               | ![badge-all-legacy][] |    |    |    |
| [no-standalone-expect](docs/rules/no-standalone-expect.md)                                                               | Disallow using `expect` outside of `it` or `test` blocks                 |                               | ![badge-all-legacy][] |    |    |    |
| [no-test-prefixes](docs/rules/no-test-prefixes.md)                                                                       | Disallow using `test` as a prefix                                        |                               | ![badge-all-legacy][] | 🔧 |    |    |
| [no-test-return-statement](docs/rules/no-test-return-statement.md)                                                       | Disallow return statements in tests                                      |                               | ![badge-all-legacy][] |    |    |    |
| [prefer-called-with](docs/rules/prefer-called-with.md)                                                                   | Suggest using `toBeCalledWith()` or `toHaveBeenCalledWith()`             |                               | ![badge-all-legacy][] | 🔧 |    |    |
| [prefer-comparison-matcher](docs/rules/prefer-comparison-matcher.md)                                                     | Suggest using the built-in comparison matchers                           |                               | ![badge-all-legacy][] | 🔧 |    |    |
| [prefer-each](docs/rules/prefer-each.md)                                                                                 | Prefer `each` rather than manual loops                                   |                               | ![badge-all-legacy][] |    |    |    |
| [prefer-equality-matcher](docs/rules/prefer-equality-matcher.md)                                                         | Suggest using the built-in quality matchers                              |                               | ![badge-all-legacy][] |    | 💡 |    |
| [prefer-expect-assertions](docs/rules/prefer-expect-assertions.md)                                                       | Suggest using expect assertions instead of callbacks                     |                               | ![badge-all-legacy][] |    | 💡 |    |
| [prefer-expect-resolves](docs/rules/prefer-expect-resolves.md)                                                           | Suggest using `expect().resolves` over `expect(await ...)` syntax        |                               | ![badge-all-legacy][] | 🔧 |    |    |
| [prefer-hooks-in-order](docs/rules/prefer-hooks-in-order.md)                                                             | Prefer having hooks in consistent order                                  |                               | ![badge-all-legacy][] |    |    |    |
| [prefer-hooks-on-top](docs/rules/prefer-hooks-on-top.md)                                                                 | Suggest having hooks before any test cases                               |                               | ![badge-all-legacy][] |    |    |    |
| [prefer-lowercase-title](docs/rules/prefer-lowercase-title.md)                                                           | Enforce lowercase titles                                                 |                               | ![badge-all-legacy][] | 🔧 |    |    |
| [prefer-mock-promise-shorthand](docs/rules/prefer-mock-promise-shorthand.md)                                             | Prefer mock resolved/rejected shorthands for promises                    |                               | ![badge-all-legacy][] | 🔧 |    |    |
| [prefer-snapshot-hint](docs/rules/prefer-snapshot-hint.md)                                                               | Prefer including a hint with external snapshots                          |                               | ![badge-all-legacy][] |    |    |    |
| [prefer-spy-on](docs/rules/prefer-spy-on.md)                                                                             | Suggest using `vi.spyOn`                                                 |                               | ![badge-all-legacy][] | 🔧 |    |    |
| [prefer-strict-equal](docs/rules/prefer-strict-equal.md)                                                                 | Prefer strict equal over equal                                           |                               | ![badge-all-legacy][] |    | 💡 |    |
| [prefer-to-be](docs/rules/prefer-to-be.md)                                                                               | Suggest using toBe()                                                     |                               | ![badge-all-legacy][] | 🔧 |    |    |
| [prefer-to-be-falsy](docs/rules/prefer-to-be-falsy.md)                                                                   | Suggest using toBeFalsy()                                                |                               | ![badge-all-legacy][] | 🔧 |    |    |
| [prefer-to-be-object](docs/rules/prefer-to-be-object.md)                                                                 | Prefer toBeObject()                                                      |                               | ![badge-all-legacy][] | 🔧 |    |    |
| [prefer-to-be-truthy](docs/rules/prefer-to-be-truthy.md)                                                                 | Suggest using `toBeTruthy`                                               |                               | ![badge-all-legacy][] | 🔧 |    |    |
| [prefer-to-contain](docs/rules/prefer-to-contain.md)                                                                     | Prefer using toContain()                                                 |                               | ![badge-all-legacy][] | 🔧 |    |    |
| [prefer-to-have-length](docs/rules/prefer-to-have-length.md)                                                             | Suggest using toHaveLength()                                             |                               | ![badge-all-legacy][] | 🔧 |    |    |
| [prefer-todo](docs/rules/prefer-todo.md)                                                                                 | Suggest using `test.todo`                                                |                               | ![badge-all-legacy][] | 🔧 |    |    |
| [require-hook](docs/rules/require-hook.md)                                                                               | Require setup and teardown to be within a hook                           |                               | ![badge-all-legacy][] |    |    |    |
| [require-local-test-context-for-concurrent-snapshots](docs/rules/require-local-test-context-for-concurrent-snapshots.md) | Require local Test Context for concurrent snapshot tests                 | ![badge-recommended-legacy][] |                       |    |    |    |
| [require-to-throw-message](docs/rules/require-to-throw-message.md)                                                       | Require toThrow() to be called with an error message                     |                               | ![badge-all-legacy][] |    |    |    |
| [require-top-level-describe](docs/rules/require-top-level-describe.md)                                                   | Enforce that all tests are in a top-level describe                       |                               | ![badge-all-legacy][] |    |    |    |
| [valid-describe-callback](docs/rules/valid-describe-callback.md)                                                         | Enforce valid describe callback                                          | ![badge-recommended-legacy][] |                       |    |    |    |
| [valid-expect](docs/rules/valid-expect.md)                                                                               | Enforce valid `expect()` usage                                           | ![badge-recommended-legacy][] |                       |    |    |    |
| [valid-title](docs/rules/valid-title.md)                                                                                 | Enforce valid titles                                                     | ![badge-recommended-legacy][] |                       | 🔧 |    |    |

<!-- end auto-generated rules list -->

#### Credits

- [eslint-plugin-jest](https://github.com/jest-community/eslint-plugin-jest)
	Most of the rules in this plugin are essentially ports of Jest plugin rules with minor modifications

### Licence

[MIT](https://github.com/veritem/eslint-plugin-vitest/blob/main/LICENSE) Licence &copy; 2022 - present [veritem](https://github.com/veritem)
