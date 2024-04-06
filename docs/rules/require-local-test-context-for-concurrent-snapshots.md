# Require local Test Context for concurrent snapshot tests (`vitest/require-local-test-context-for-concurrent-snapshots`)

<<<<<<< HEAD
💼 This rule is enabled in the ✅ `recommended` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
<!-- end auto-generated rule header -->

## Rule details

Examples of **incorrect** code for this rule:

```js
test.concurrent('myLogic', () => {
    expect(true).toMatchSnapshot();
})

describe.concurrent('something', () => {
    test('myLogic', () => {
        expect(true).toMatchInlineSnapshot();
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
