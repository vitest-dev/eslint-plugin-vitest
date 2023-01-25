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

### Rules

<!-- begin auto-generated rules list -->

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                           | Description                                                              | 🔧 |
| :------------------------------------------------------------- | :----------------------------------------------------------------------- | :- |
| [consistent-test-it](docs/rules/consistent-test-it.md)         | Prefer test or it but not both                                           | 🔧 |
| [expect-expect](docs/rules/expect-expect.md)                   | Enforce having expectation in test body                                  |    |
| [max-nested-describe](docs/rules/max-nested-describe.md)       | Nested describe block should be less than set max value or default value |    |
| [no-conditional-tests](docs/rules/no-conditional-tests.md)     | Disallow conditional tests                                               |    |
| [no-focused-tests](docs/rules/no-focused-tests.md)             | Disallow focused tests                                                   | 🔧 |
| [no-identical-title](docs/rules/no-identical-title.md)         | Disallow identical titles                                                | 🔧 |
| [no-skipped-tests](docs/rules/no-skipped-tests.md)             | Disallow skipped tests                                                   |    |
| [prefer-lowercase-title](docs/rules/prefer-lowercase-title.md) | Enforce lowercase titles                                                 | 🔧 |
| [prefer-to-be](docs/rules/prefer-to-be.md)                     | Suggest using toBe()                                                     | 🔧 |

<!-- end auto-generated rules list -->

#### Credits

- [eslint-plugin-jest](https://github.com/jest-community/eslint-plugin-jest)

### Licence

[MIT](https://github.com/veritem/eslint-plugin-vitest/blob/main/LICENSE) Licence &copy; 2022 - present [veritem](https://github.com/veritem)
