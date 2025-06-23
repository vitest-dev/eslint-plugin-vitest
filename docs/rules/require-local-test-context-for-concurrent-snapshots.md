# require-local-test-context-for-concurrent-snapshots

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
