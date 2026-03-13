# vitest/max-nested-describe

📝 Require describe block to be less than set max value or default value.

⚠️ This rule _warns_ in the 🌐 `all` config.

<!-- end auto-generated rule header -->

## Rule Details

Examples of **incorrect** code for this rule with `max: 1`:

```js
describe('outer', () => {
  describe('inner', () => {
    // ...
  })
})
```

Examples of **correct** code for this rule:

```js
describe('inner', () => {
  // ...
})
```

## Options

<!-- begin auto-generated rule options list -->

| Name  | Description                                          | Type   | Default |
| :---- | :--------------------------------------------------- | :----- | :------ |
| `max` | Maximum allowed nesting depth for `describe` blocks. | Number | `5`     |

<!-- end auto-generated rule options list -->

> Default: `5`

Maximum number of nested `describe` blocks.

```js
{
  max: number
}
```
