# Enforce using a function as a describe title over an equivalent string (`@vitest/prefer-describe-function-title`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to enforce passing a named function to `describe()` instead of an equivalent hardcoded string.

Passing named functions means the correct title will be used even if the function is renamed.
This rule will report if a string is passed to a `describe()` block if:

* The string matches a function imported into the file
* That function's name also matches the test file's name

Examples of **incorrect** code for this rule:

```ts
// myFunction.test.js
import { myFunction } from "./myFunction"

describe("myFunction", () => {
  // ...
})
```

Examples of **correct** code for this rule:

```ts
// myFunction.test.js
import { myFunction } from "./myFunction"

describe(myFunction, () => {
  // ...
})
```
