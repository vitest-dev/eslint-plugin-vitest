# no-large-snapshots

⚠️ This rule _warns_ in the 🌍 `legacy-all` config.

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to prevent large snapshots.

### Options

This rule accepts an object with the following properties:

- `maxSize` (default: `50`): The maximum size of a snapshot.
- `inlineMaxSize` (default: `0`): The maximum size of a snapshot when it is inline.
- `allowedSnapshots` (default: `[]`): The list of allowed snapshots.

### For example:

```json
{
  "vitest/no-large-snapshots": [
    "error",
    {
      "maxSize": 50,
      "inlineMaxSize": 0,
      "allowedSnapshots": []
    }
  ]
}
```

Examples of **incorrect** code for this rule with the above configuration:

```js
test('large snapshot', () => {
  expect('a'.repeat(100)).toMatchSnapshot()
})
```

Examples of **correct** code for this rule with the above configuration:

```js
test('large snapshot', () => {
  expect('a'.repeat(50)).toMatchSnapshot()
})
```

## When Not To Use It

If you don't want to limit the size of your snapshots, you can disable this rule.
