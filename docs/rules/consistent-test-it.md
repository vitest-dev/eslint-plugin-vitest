# vitest/consistent-test-it

📝 Enforce using test or it but not both.

⚠️ This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

By default, this rule enforces `test` at the top level, and `it` inside a `describe` block.

Examples of **incorrect** code for this rule:

```js
test('using test function', () => {
  // ...
})

// Invalid: the top level keyword defaults to `test`
it('using it function', () => {
  // ...
})
```

Examples of **correct** code for this rule:

```js
test('using test function', () => {
  // ...
})

test('using only test function', () => {
  // ...
})
```

### Options

<!-- begin auto-generated rule options list -->

| Name             | Description                                        | Type   | Choices      |
| :--------------- | :------------------------------------------------- | :----- | :----------- |
| `fn`             | Preferred global test function keyword.            | String | `test`, `it` |
| `withinDescribe` | Preferred test function keyword inside `describe`. | String | `test`, `it` |

<!-- end auto-generated rule options list -->

```json
{
  "type": "object",
  "properties": {
    "fn": {
      "enum": ["it", "test"]
    },
    "withinDescribe": {
      "enum": ["it", "test"]
    }
  },
  "additionalProperties": false
}
```

##### `fn`

Decides whether to prefer `test` or `it`. Defaults to `test`.

```js
/*eslint vitest/consistent-test-it: ["error", {"fn": "test"}]*/

test('it works', () => {
  // <-- Valid
  // ...
})

test.only('it works', () => {
  // <-- Valid
  // ...
})

it('it works', () => {
  // <-- Invalid
  // ...
})

it.only('it works', () => {
  // <-- Invalid
  // ...
})
```

##### `withinDescribe`

Decides whether to prefer `test` or `it` when used within a `describe` block. Defaults to the value of `fn` when it is set, otherwise `it`.

```js
/*eslint vitest/consistent-test-it: ["error", {"withinDescribe": "it"}]*/

describe('suite', () => {
  it('it works', () => {
    // <-- Valid
    // ...
  })

  it.only('it works', () => {
    // <-- Valid
    // ...
  })

  test('it works', () => {
    // <-- Invalid
    // ...
  })

  test.only('it works', () => {
    // <-- Invalid
    // ...
  })
})
```

The default configuration is top level `test` and all tests nested with `describe` to use `it`.
