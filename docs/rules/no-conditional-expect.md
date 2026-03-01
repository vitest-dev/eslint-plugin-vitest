# vitest/no-conditional-expect

📝 Disallow conditional expects.

💼⚠️ This rule is enabled in the ✅ `recommended` config. This rule _warns_ in the 🌐 `all` config.

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to prevent false positive test results by highlighting conditional expect statements.

Examples of **incorrect** code for this rule:

```ts
test('foo', () => {
  if (false) {
    expect(1).toBe(1)
  }
})

test.for([null, { bar: 'baz' }])('quux', (value) => {
  const expected = value === null ? expected : expect.stringContaining(expected)
  expect(actual).toEqual(expected)
})
```

Examples of **correct** code for this rule:

```ts
test('foo', () => {
  expect(1).toBe(1)
})

test.for([null, expect.objectContaining({ bar: 'baz' })])(
  'quux',
  (expected) => {
    expect(actual).toEqual(expected)
  },
)
```

## Options

<!-- begin auto-generated rule options list -->

| Name               | Description                                                      | Type    |
| :----------------- | :--------------------------------------------------------------- | :------ |
| `expectAssertions` | Enable/disable whether expect.assertions() is taken into account | Boolean |

<!-- end auto-generated rule options list -->

#### expectAssertions

```json
{
  "rules": {
    "vitest/no-conditional-expect": ["error", { "expectAssertions": true }]
  }
}
```

Enable/disable whether to take the usage of `expect.assertions()` into account. Setting this to true will allow conditional expressions only if a call to `expect.assertions()` is also made.

```ts
test('foo', () => {
  expect.assertions(1)

  if (true) {
    expect(1).toBe(1)
  }
})
```
