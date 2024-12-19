# Disallow using `expect` outside of `it` or `test` blocks (`vitest/no-standalone-expect`)

⚠️ This rule _warns_ in the 🌐 `all` config.

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to prevent the use of `expect` outside of `it` or `test` blocks.

### Options

```json
{
  "vitest/no-standalone-expect": [
    "error",
    {
      "additionalTestBlockFunctions": ["test"]
    }
  ]
}
```

example:

```js
// invalid

expect(1).toBe(1)

// valid

it('should be 1', () => {
  expect(1).toBe(1)
})
```
