# Disallow conditional tests (`vitest/no-conditional-tests`)

<<<<<<< HEAD
⚠️ This rule _warns_ in the 🌐 `all` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
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
	if (Math.random() > 0.5) {
		it('is awesome', () => {
			doTheThing()
		})
	}
})
```
