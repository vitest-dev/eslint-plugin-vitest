# Prefer having hooks in consistent order (`vitest/prefer-hooks-in-order`)

<<<<<<< HEAD
⚠️ This rule _warns_ in the 🌐 `all` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
<!-- end auto-generated rule header -->

```js 
  // consistent order of hooks
  ['beforeAll', 'beforeEach', 'afterEach', 'afterAll']
```

```js
  // bad
   afterAll(() => {
		removeMyDatabase();
	});
	beforeAll(() => {
		createMyDatabase();
	});
```

```js
  // good
   beforeAll(() => {
		createMyDatabase();
	});
	afterAll(() => {
		removeMyDatabase();
	});
```