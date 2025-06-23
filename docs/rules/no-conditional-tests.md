# Disallow conditional tests (`@vitest/no-conditional-tests`)

⚠️ This rule _warns_ in the `legacy-all` config.

<!-- end auto-generated rule header -->

## Rule Details

Examples of **incorrect** code for this rule:

```js
describe('my tests', () => {
	if (true) {
		it('is awesome', () => {
			doTheThing()
		})
	}
})
```

Examples of **correct** code for this rule:

```js
describe('my tests', () => {
	it('is awesome', () => {
		doTheThing()
	})
})
```
