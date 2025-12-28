# Disallow conditional expects (`vitest/no-conditional-expect`)

💼⚠️ This rule is enabled in the ✅ `recommended` config. This rule _warns_ in the 🌐 `all` config.

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to prevent conditional expects.

Examples of **incorrect** code for this rule:

```ts
test('foo', () => {
  if (true) {
    expect(1).toBe(1)
  }
})
```

Examples of **correct** code for this rule:

```ts
test('foo', () => {
  expect(1).toBe(1)
})
```

## Options

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "expectAssertions": {
      "description": "Enable/disable whether expect.assertions() is taken into account",
      "type": "boolean"
    }
  }
}
```

### `expectAssertions`

Enable/disable whether to take the usage of `expect.assertions()` into account. Setting this to true will allow conditional expressions only if a call to `expect.assertions()` is also made.

```ts
test('foo', () => {
  expect.assertions(1)

  if (true) {
    expect(1).toBe(1)
  }
})
```
