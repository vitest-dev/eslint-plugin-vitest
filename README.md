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

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).\
❌ Deprecated.

| Name                                                                                                                     | Description                                                              | 🔧 | 💡 | ❌  |
| :----------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------- | :- | :- | :- |
| [consistent-test-filename](docs/rules/consistent-test-filename.md)                                                       | forbidden .spec test file pattern                                        |    |    |    |
| [consistent-test-it](docs/rules/consistent-test-it.md)                                                                   | Prefer test or it but not both                                           | 🔧 |    |    |
| [expect-expect](docs/rules/expect-expect.md)                                                                             | Enforce having expectation in test body                                  |    |    |    |
| [max-expects](docs/rules/max-expects.md)                                                                                 | Enforce a maximum number of expect per test                              |    |    |    |
| [max-nested-describe](docs/rules/max-nested-describe.md)                                                                 | Nested describe block should be less than set max value or default value |    |    |    |
| [no-alias-methods](docs/rules/no-alias-methods.md)                                                                       | Disallow alias methods                                                   | 🔧 |    |    |
| [no-commented-out-tests](docs/rules/no-commented-out-tests.md)                                                           | Disallow commented out tests                                             |    |    |    |
| [no-conditional-expect](docs/rules/no-conditional-expect.md)                                                             | Disallow conditional expects                                             |    |    |    |
| [no-conditional-in-test](docs/rules/no-conditional-in-test.md)                                                           | Disallow conditional tests                                               |    |    |    |
| [no-conditional-tests](docs/rules/no-conditional-tests.md)                                                               | Disallow conditional tests                                               |    |    |    |
| [no-disabled-tests](docs/rules/no-disabled-tests.md)                                                                     | Disallow disabled tests                                                  |    |    |    |
| [no-done-callback](docs/rules/no-done-callback.md)                                                                       | Disallow using a callback in asynchronous tests and hooks                |    | 💡 | ❌  |
| [no-duplicate-hooks](docs/rules/no-duplicate-hooks.md)                                                                   | Disallow duplicate hooks and teardown hooks                              |    |    |    |
| [no-focused-tests](docs/rules/no-focused-tests.md)                                                                       | Disallow focused tests                                                   | 🔧 |    |    |
| [no-hooks](docs/rules/no-hooks.md)                                                                                       | Disallow setup and teardown hooks                                        |    |    |    |
| [no-identical-title](docs/rules/no-identical-title.md)                                                                   | Disallow identical titles                                                | 🔧 |    |    |
| [no-import-node-test](docs/rules/no-import-node-test.md)                                                                 | Disallow importing `node:test`                                           | 🔧 |    |    |
| [no-interpolation-in-snapshots](docs/rules/no-interpolation-in-snapshots.md)                                             | Disallow string interpolation in snapshots                               | 🔧 |    |    |
| [no-large-snapshots](docs/rules/no-large-snapshots.md)                                                                   | Disallow large snapshots                                                 |    |    |    |
| [no-mocks-import](docs/rules/no-mocks-import.md)                                                                         | Disallow importing from __mocks__ directory                              |    |    |    |
| [no-restricted-matchers](docs/rules/no-restricted-matchers.md)                                                           | Disallow the use of certain matchers                                     |    |    |    |
| [no-restricted-vi-methods](docs/rules/no-restricted-vi-methods.md)                                                       | Disallow specific `vi.` methods                                          |    |    |    |
| [no-standalone-expect](docs/rules/no-standalone-expect.md)                                                               | Disallow using `expect` outside of `it` or `test` blocks                 |    |    |    |
| [no-test-prefixes](docs/rules/no-test-prefixes.md)                                                                       | Disallow using `test` as a prefix                                        | 🔧 |    |    |
| [no-test-return-statement](docs/rules/no-test-return-statement.md)                                                       | Disallow return statements in tests                                      |    |    |    |
| [prefer-called-with](docs/rules/prefer-called-with.md)                                                                   | Suggest using `toBeCalledWith()` or `toHaveBeenCalledWith()`             | 🔧 |    |    |
| [prefer-comparison-matcher](docs/rules/prefer-comparison-matcher.md)                                                     | Suggest using the built-in comparison matchers                           | 🔧 |    |    |
| [prefer-each](docs/rules/prefer-each.md)                                                                                 | Prefer `each` rather than manual loops                                   |    |    |    |
| [prefer-equality-matcher](docs/rules/prefer-equality-matcher.md)                                                         | Suggest using the built-in quality matchers                              |    | 💡 |    |
| [prefer-expect-assertions](docs/rules/prefer-expect-assertions.md)                                                       | Suggest using expect assertions instead of callbacks                     |    | 💡 |    |
| [prefer-expect-resolves](docs/rules/prefer-expect-resolves.md)                                                           | Suggest using `expect().resolves` over `expect(await ...)` syntax        | 🔧 |    |    |
| [prefer-hooks-in-order](docs/rules/prefer-hooks-in-order.md)                                                             | Prefer having hooks in consistent order                                  |    |    |    |
| [prefer-hooks-on-top](docs/rules/prefer-hooks-on-top.md)                                                                 | Suggest having hooks before any test cases                               |    |    |    |
| [prefer-lowercase-title](docs/rules/prefer-lowercase-title.md)                                                           | Enforce lowercase titles                                                 | 🔧 |    |    |
| [prefer-mock-promise-shorthand](docs/rules/prefer-mock-promise-shorthand.md)                                             | Prefer mock resolved/rejected shorthands for promises                    | 🔧 |    |    |
| [prefer-snapshot-hint](docs/rules/prefer-snapshot-hint.md)                                                               | Prefer including a hint with external snapshots                          |    |    |    |
| [prefer-spy-on](docs/rules/prefer-spy-on.md)                                                                             | Suggest using `vi.spyOn`                                                 | 🔧 |    |    |
| [prefer-strict-equal](docs/rules/prefer-strict-equal.md)                                                                 | Prefer strict equal over equal                                           |    | 💡 |    |
| [prefer-to-be](docs/rules/prefer-to-be.md)                                                                               | Suggest using toBe()                                                     | 🔧 |    |    |
| [prefer-to-be-falsy](docs/rules/prefer-to-be-falsy.md)                                                                   | Suggest using toBeFalsy()                                                | 🔧 |    |    |
| [prefer-to-be-object](docs/rules/prefer-to-be-object.md)                                                                 | Prefer toBeObject()                                                      | 🔧 |    |    |
| [prefer-to-be-truthy](docs/rules/prefer-to-be-truthy.md)                                                                 | Suggest using `toBeTruthy`                                               | 🔧 |    |    |
| [prefer-to-contain](docs/rules/prefer-to-contain.md)                                                                     | Prefer using toContain()                                                 | 🔧 |    |    |
| [prefer-to-have-length](docs/rules/prefer-to-have-length.md)                                                             | Suggest using toHaveLength()                                             | 🔧 |    |    |
| [prefer-todo](docs/rules/prefer-todo.md)                                                                                 | Suggest using `test.todo`                                                | 🔧 |    |    |
| [require-hook](docs/rules/require-hook.md)                                                                               | Require setup and teardown to be within a hook                           |    |    |    |
| [require-local-test-context-for-concurrent-snapshots](docs/rules/require-local-test-context-for-concurrent-snapshots.md) | Require local Test Context for concurrent snapshot tests                 |    |    |    |
| [require-to-throw-message](docs/rules/require-to-throw-message.md)                                                       | Require toThrow() to be called with an error message                     |    |    |    |
| [require-top-level-describe](docs/rules/require-top-level-describe.md)                                                   | Enforce that all tests are in a top-level describe                       |    |    |    |
| [valid-describe-callback](docs/rules/valid-describe-callback.md)                                                         | Enforce valid describe callback                                          |    |    |    |
| [valid-expect](docs/rules/valid-expect.md)                                                                               | Enforce valid `expect()` usage                                           |    |    |    |
| [valid-title](docs/rules/valid-title.md)                                                                                 | Enforce valid titles                                                     | 🔧 |    |    |

<!-- end auto-generated rules list -->

#### Credits

- [eslint-plugin-jest](https://github.com/jest-community/eslint-plugin-jest)
	Most of the rules in this plugin are essentially ports of Jest plugin rules with minor modifications

### Licence

[MIT](https://github.com/veritem/eslint-plugin-vitest/blob/main/LICENSE) Licence &copy; 2022 - present [veritem](https://github.com/veritem)
