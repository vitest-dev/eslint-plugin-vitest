# Enforce that all tests are in a top-level describe (`vitest/require-top-level-describe`)

⚠️ This rule _warns_ in the 🌐 `all` config.

<!-- end auto-generated rule header -->

This rule triggers warning if a test case (`test` and `it`) or a hook (`beforeAll`, `beforeEach`, `afterEach`, `afterAll`) is not located in a top-level `describe` block.


The following patterns are considered warnings:

```js
test('foo', () => {})

beforeEach(() => {
	describe('bar', () => {
		test('baz', () => {})
	})
})


```

The following patterns are not considered warnings:

```js
describe('foo', () => {
	test('bar', () => {})
})

describe('foo', () => {
	beforeEach(() => {
		describe('bar', () => {
			test('baz', () => {})
		})
	})
})

```