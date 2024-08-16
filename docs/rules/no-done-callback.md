# Disallow using a callback in asynchronous tests and hooks (`@vitest/no-done-callback`)

❌ This rule is deprecated.

⚠️ This rule _warns_ in the 🌐 `all` config.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to prevent the use of a callback in asynchronous tests and hooks.

Examples of **incorrect** code for this rule:

```js
test('foo', (done) => {
  setTimeout(done, 1000)
})

test('foo', (done) => {
  setTimeout(() => done(), 1000)
})

test('foo', (done) => {
  setTimeout(() => {
	done()
  }, 1000)
})

test('foo', (done) => {
  setTimeout(() => {
	done()
  }, 1000)
})
```

Examples of **correct** code for this rule:

```js
test('foo', async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
})

test('foo', async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 1000))
})

test('foo', async () => {
  await new Promise((resolve) => setTimeout(() => {
	resolve()
  }, 1000))
})

test('foo', async () => {
  await new Promise((resolve) => setTimeout(() => {
	resolve()
  }, 1000))
})

test.concurrent('foo', ({ expect }) => {
  expect(1).toMatchSnapshot();
});

test.concurrent('foo', (context) => {
  context.expect(1).toBe(1);
});

describe.concurrent('foo', () => {
  test('foo', ({ expect }) => {
    expect(1).toBe(1);
  });
});
```
