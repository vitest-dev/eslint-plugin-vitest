# Enforce valid titles (`vitest/valid-title`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

# Rule Details

This rule aims to enforce valid titles for tests.

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
	expect(1).toBeNumber()
  })
})
```

Examples of **correct** code for this rule with the `{ "ignoreTypeOfDescribeName": false }` option:

```js
describe('1', () => {
  it('should be a number', () => {
	expect(1).toBeNumber()
  })
})
```

### `allowArguments`

If `true`, the rule ignores the arguments of `describe` function.

Examples of **correct** code for this rule with the `{ "allowArguments": false }` option:

```js
describe('name', () => {})
```

Examples of **correct** code for this rule with the `{ "allowArguments": true }` option:

```js
describe(foo, () => {})
```

### `disallowedWords`

An array of words that are not allowed in the test title.

Examples of **incorrect** code for this rule with the `{ "disallowedWords": ["skip", "only"] }` option:

```js
describe('foo', () => {
  it.skip('should be skipped', () => {
	expect(1).toBeNumber()
  })
})
```

Examples of **correct** code for this rule with the `{ "disallowedWords": ["skip", "only"] }` option:

```js
describe('foo', () => {
  it('should be skipped', () => {
	expect(1).toBeNumber()
  })
})
```

### `mustNotMatch`

An array of regex strings that are not allowed in the test title.

Examples of **incorrect** code for this rule with the `{ "mustNotMatch": ["^\\s+$", "^\\s*\\d+\\s*$"] }` option:

```js
describe('foo', () => {
  it('  ', () => {
	expect(1).toBeNumber()
  })
})
```

Examples of **correct** code for this rule with the `{ "mustNotMatch": ["^\\s+$", "^\\s*\\d+\\s*$"] }` option:

```js

describe('foo', () => {
  it('should be a number', () => {
	expect(1).toBeNumber()
  })
})
```

### `mustMatch`

An array of regex strings that are required in the test title.

Examples of **incorrect** code for this rule with the `{ "mustMatch": ["^\\s*\\w+\\s*$"] }` option:

```js
describe('foo', () => {
  it('  ', () => {
	expect(1).toBeNumber()
  })
})
```

Examples of **correct** code for this rule with the `{ "mustMatch": ["^\\s*\\w+\\s*$"] }` option:

```js

describe('foo', () => {
  it('should be a number', () => {
	expect(1).toBeNumber()
  })
})
```
