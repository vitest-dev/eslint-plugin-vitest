# Enforce that all tests are in a top-level describe (`vitest/require-top-level-describe`)

⚠️ This rule _warns_ in the `all-legacy` config.

<!-- end auto-generated rule header -->

This rule triggers warning if a test case (`test` and `it`) or a hook (`beforeAll`, `beforeEach`, `afterEach`, `afterAll`) is not located in a top-level `describe` block.


## Options

This rule accepts an object with the following properties: 

- `maxNumberOfTopLevelDescribes`: The maximum number of top-level tests allowed in a file. Defaults to `Infinity`. Allowing any number of top-level describe blocks.

```json
{
	"vitest/require-top-level-describe": [
		"error", 
		{ 
			"maxNumberOfTopLevelDescribes": 2 
		}
	]
}
```



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




