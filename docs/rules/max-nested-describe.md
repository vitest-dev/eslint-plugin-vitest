# max-nested-describe

⚠️ This rule _warns_ in the 🌍 `legacy-all` config.

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

> Default: `5`

Maximum number of nested `describe` blocks.

```js
{
  max: number
}
```
