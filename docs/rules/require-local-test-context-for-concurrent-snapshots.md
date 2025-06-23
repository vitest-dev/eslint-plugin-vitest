# require-local-test-context-for-concurrent-snapshots

💼⚠️ This rule is enabled in the ☑️ `legacy-recommended` config. This rule _warns_ in the 🔵 `legacy-all` config.

<!-- end auto-generated rule header -->

## Rule details

Examples of **incorrect** code for this rule:

```js
test.concurrent('myLogic', () => {
  expect(true).toMatchSnapshot()
})

describe.concurrent('something', () => {
  test('myLogic', () => {
    expect(true).toMatchInlineSnapshot()
  })
})
```

Examples of **correct** code for this rule:

```js
test.concurrent('myLogic', ({ expect }) => {
    expect(true).toMatchSnapshot();
})

test.concurrent('myLogic', (context) => {
    context.expect(true).toMatchSnapshot();
}
```
