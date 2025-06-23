# Enforce having hooks in consistent order (`@vitest/prefer-hooks-in-order`)

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