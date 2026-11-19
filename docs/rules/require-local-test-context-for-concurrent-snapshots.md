# vitest/require-local-test-context-for-concurrent-snapshots

📝 Require local Test Context for concurrent snapshot tests.

💼⚠️ This rule is enabled in the ✅ `recommended` config. This rule _warns_ in the 🌐 `all` config.

<!-- end auto-generated rule header -->

## Rationale

When tests run concurrently, the global `expect` cannot reliably tell which test a snapshot belongs to. Vitest requires snapshot assertions in concurrent tests to use the `expect` from the local test context so that each snapshot is attached to the right test.

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
  expect(true).toMatchSnapshot()
})

test.concurrent('myLogic', (context) => {
  context.expect(true).toMatchSnapshot()
})
```
