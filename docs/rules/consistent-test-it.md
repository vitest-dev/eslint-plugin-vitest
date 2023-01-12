# Prefer test or it but not both (`vitest/consistent-test-it`)

<!-- end auto-generated rule header -->

### Rule Details

Examples of **incorrect** code for this rule:

```js
test('it works', () => {
	// ...
})

it('it works', () => {
	// ...
})
```

Examples of **correct** code for this rule:

```js
test('it works', () => {
	// ...
})
```

```js
test('it works', () => {
	// ...
})
```

#### Options

> Default fn: `test`

Preferred test function name.

```js
{
	fn: 'test' | 'it'
}
```
