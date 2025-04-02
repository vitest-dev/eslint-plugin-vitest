# Enforce valid titles (`vitest/valid-title`)

💼 This rule is enabled in the ✅ `recommended` config.

⚠️ This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

# Rule Details

This rule aims to enforce valid titles for `describe`, `it` and `test` titles.

## Options

This rule has an object option:

```json
{
  "vitest/valid-title": [
	"error",
   {
    "ignoreTypeOfDescribeName": false,
    "allowArguments": false,
    "disallowedWords": ["skip", "only"],
    "mustNotMatch": ["^\\s+$", "^\\s*\\d+\\s*$"],
    "mustMatch": ["^\\s*\\w+\\s*$"]
    }
  ]
}
```

### `ignoreTypeOfDescribeName`

If `true`, the rule ignores the type of the first argument of `describe` function.

Examples of **incorrect** code for this rule with the `{ "ignoreTypeOfDescribeName": false }` option:

```js
describe(1, () => {
  it('should be a number', () => {
	expect(1).toBe(1)
  })
})
```

Examples of **correct** code for this rule with the `{ "ignoreTypeOfDescribeName": false }` option:

```js
describe('1', () => {
  it('should be a number', () => {
	expect(1).toBe(1)
  })
})
```

### `allowArguments`

If `true`, the rule ignores the arguments of the `describe`, `test`, and `it` functions.

Examples of **correct** code for this rule with the `{ "allowArguments": false }` option:

```js
describe('name', () => {
  it('name', () => {

  })
})
```

Examples of **correct** code for this rule with the `{ "allowArguments": true }` option:

```js
describe(foo, () => {
   it(hoge, () => {

  })
})
```

### `disallowedWords`

An array of words that are not allowed in the test title.

Examples of **incorrect** code for this rule with the `{ "disallowedWords": ["skip", "only"] }` option:

```js
describe('foo', () => {
  it.skip('should be skipped', () => {
	expect(1).toBe(1)
  })
})
```

Examples of **correct** code for this rule with the `{ "disallowedWords": ["skip", "only"] }` option:

```js
describe('foo', () => {
  it('should be skipped', () => {
	expect(1).toBe(1)
  })
})
```

### `mustNotMatch`

An array of regex strings that are not allowed in the test title.

Examples of **incorrect** code for this rule with the `{ "mustNotMatch": ["^\\s+$", "^\\s*\\d+\\s*$"] }` option:

```js
describe('foo', () => {
  it('  ', () => {
	expect(1).toBe(1)
  })
})
```

Examples of **correct** code for this rule with the `{ "mustNotMatch": ["^\\s+$", "^\\s*\\d+\\s*$"] }` option:

```js

describe('foo', () => {
  it('should be a number', () => {
	expect(1).toBe(1)
  })
})
```

### `mustMatch`

An array of regex strings that are required in the test title.

If you specify an array of regex strings, the check is performed on `describe`, `test` and `it` titles.

For more granular control, you can specify an object with the following properties :

- `describe`: an array of regex strings that are required in the `describe` title.
- `test`: an array of regex strings that are required in the `test` title.
- `it`: an array of regex strings that are required in the `it` title.

Examples of **incorrect** code for this rule with the `{ "mustMatch": ["^\\s*\\w+\\s*$"] }` option:

```js
describe('foo', () => {
  it('  ', () => {
	expect(1).toBe(1)
  })
})
```

Examples of **correct** code for this rule with the `{ "mustMatch": ["^\\s*\\w+\\s*$"] }` option:

```js

describe('foo', () => {
  it('should be a number', () => {
	expect(1).toBe(1)
  })
})
```

Examples of **incorrect** code for this rule with the `{ "mustMatch": { "it": ["^should .+\.$"] } }` option:

```js
// The describe title is checked with the default regex, so it's valid
describe('foo', () => {
  // This check fails because the title does not match the regex
  it('Should be a number', () => {
    expect(1).toBe(1)
  })
})
```

Examples of **correct** code for this rule with the `{ "mustMatch": { "describe": ["^\\s*\\w+\\s*$"] } }` option:

```js
// The describe title is checked with the default regex, so it's valid
describe('foo', () => {
  // This check succeeds because the title matches the regex
  it('should be a number.', () => {
    expect(1).toBe(1)
  })
})
```

Note: If you'd like to use a function or class names inside `describe`, `test` or `it` blocks as a parameter, you must enable vitest's type checking.

To enable typechecking for vitest make sure settings key is added in your configuration

```js
import vitest from "eslint-plugin-vitest";

export default [
 {
  files: ["tests/**"],
  plugins: {
     vitest
  },
  rules: {
   ...vitest.configs.recommended.rules
  },
  settings: {
      vitest: {
        typecheck: true
    }
   }
 }
]
```
