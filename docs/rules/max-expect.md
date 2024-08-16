# Enforce a maximum number of expect per test (`@vitest/max-expect`)

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

> Default: `5`

Maximum number of `expect` per test.

```js
{
  max: number
}
```
