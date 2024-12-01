# Require local Test Context for concurrent snapshot tests (`vitest/require-local-test-context-for-concurrent-snapshots`)

💼 This rule is enabled in the ✅ `recommended` config.

⚠️ This rule _warns_ in the 🌐 `all` config.

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
