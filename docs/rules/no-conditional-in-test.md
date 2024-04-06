# Disallow conditional tests (`vitest/no-conditional-in-test`)

<<<<<<< HEAD
⚠️ This rule _warns_ in the 🌐 `all` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
<!-- end auto-generated rule header -->
### Rule Details

This rule aims to prevent conditional tests.

Examples of **incorrect** code for this rule:

```js
test('my test', () => {
  if (true) {
	doTheThing()
  }
})
```

Examples of **correct** code for this rule:

```js
test('my test', () => {
   expect(true).toBe(true)
})
```
