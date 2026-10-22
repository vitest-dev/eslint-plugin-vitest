# vitest/no-standalone-expect

📝 Disallow using `expect` outside of `it` or `test` blocks.

💼⚠️ This rule is enabled in the ✅ `recommended` config. This rule _warns_ in the 🌐 `all` config.

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to prevent the use of `expect` outside of `it` or `test` blocks.

### Options

<!-- begin auto-generated rule options list -->

| Name                           | Description                                                 | Type     | Default |
| :----------------------------- | :---------------------------------------------------------- | :------- | :------ |
| `additionalTestBlockFunctions` | Additional functions that should be treated as test blocks. | String[] | `[]`    |

<!-- end auto-generated rule options list -->

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
