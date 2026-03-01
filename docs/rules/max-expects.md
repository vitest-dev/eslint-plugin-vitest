# vitest/max-expects

📝 Enforce a maximum number of expect per test.

⚠️ This rule _warns_ in the 🌐 `all` config.

<!-- end auto-generated rule header -->

### Rule Details

Examples of **incorrect** code for this rule with `max: 1`:

```js
test('foo', () => {
  expect(1).toBe(1)
  expect(2).toBe(2)
})
```

Examples of **correct** code for this rule:

```js
test('foo', () => {
  expect(1).toBe(1)
})
```

### Options

<!-- begin auto-generated rule options list -->

| Name  | Description                                         | Type   |
| :---- | :-------------------------------------------------- | :----- |
| `max` | Maximum number of `expect` calls allowed in a test. | Number |

<!-- end auto-generated rule options list -->

> Default: `5`

Maximum number of `expect` per test.

```js
{
  max: number
}
```
