# Enforce using expect assertions instead of callbacks (`@vitest/prefer-expect-assertions`)

⚠️ This rule _warns_ in the 🌐 `all` config.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

Ensure every test to have either `expect.assertions(<number of assertions>)` OR
`expect.hasAssertions()` as its first expression.

This will warn if a test has no assertions, or if it has assertions but they are not the first expression.

## Examples

Examples of **incorrect** code for this rule:

```js
test('no assertions', () => {
  // ...
});

test('assertions not first', () => {
  expect(true).toBe(true);
  // ...
});
```

Examples of **correct** code for this rule:

```js
test('assertions first', () => {
  expect.assertions(1);
  // ...
});

test('assertions first', () => {
  expect.hasAssertions();
  // ...
});
```

## Options

`onlyFunctionsWithAsyncKeyword` (default: `false`)

When `true`, only functions with the `async` keyword will be checked.

when this option is enabled the following code will be considered incorrect:

```js
test('assertions first', () => {
   const data = await fetchData();
   expect(data).toBe('peanut butter');
});
```

To fix this, you'll need to add `expect.assertions(1)` or `expect.hasAssertions()` as the first expression:

```js
test('assertions first', () => {
   expect.assertions(1);
   const data = await fetchData();
   expect(data).toBe('peanut butter');
});
```

`onlyFunctionsWithExpectInLoop` (default: `false`)

When `true`, only functions with `expect` in a loop will be checked.

when this option is enabled the following code will be considered incorrect:

```js
test('assertions first', () => {
   for (let i = 0; i < 10; i++) {
	 expect(i).toBeLessThan(10);
   }
});
```

To fix this, you'll need to add `expect.assertions(1)` or `expect.hasAssertions()` as the first expression:

```js
test('assertions first', () => {
   expect.hasAssertions();
   for (let i = 0; i < 10; i++) {
	 expect(i).toBeLessThan(10);
   }
});
```

`onlyFunctionsWithExpectInCallback`

When `true`, only functions with `expect` in a callback will be checked.

when this option is enabled the following code will be considered incorrect:

```js
test('assertions first', () => {
   fetchData((data) => {
	 expect(data).toBe('peanut butter');
   });
});
```

To fix this, you'll need to add `expect.assertions(1)` or `expect.hasAssertions()` as the first expression:

```js
test('assertions first', () => {
   expect.assertions(1);
   fetchData((data) => {
	 expect(data).toBe('peanut butter');
   });
});
```
