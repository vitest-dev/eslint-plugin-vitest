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
  "plugins": ["vitest"],
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

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "vitest/no-skipped-tests": 2
  }
}
```

### List of supported rules

| Name                                                    | Description                                       |
|:--------------------------------------------------------|:--------------------------------------------------|
| [lower-case-title](src/rules/lower-case-title.ts)       | Enforce lowercase test names                      |
| [max-nested-describe](src/rules/max-nested-describe.ts) | Enforces a maximum depth to nested describe calls |
| [no-focused-tests](src/rules/no-focused-tests.ts)       | Disallow focused tests                            |
| [no-identical-title](src/rules/no-identical-title.ts)   | Disallow identical titles                         |
| [no-skipped-tests](src/rules/no-skipped-tests.ts)       | Disallow skipped tests                            |

#### Credits

- [eslint-plugin-jest](https://github.com/jest-community/eslint-plugin-jest)

### Licence

[MIT](https://github.com/veritem/eslint-plugin-vitest/blob/main/LICENSE) Licence &copy; 2022 - present [veritem](https://github.com/veritem)
