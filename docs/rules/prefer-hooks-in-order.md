# vitest/prefer-hooks-in-order

📝 Enforce having hooks in consistent order.

⚠️ This rule _warns_ in the 🌐 `all` config.

<!-- end auto-generated rule header -->

```js
// consistent order of hooks
;['beforeAll', 'beforeEach', 'afterEach', 'afterAll']
```

```js
// bad
afterAll(() => {
  removeMyDatabase()
})
beforeAll(() => {
  createMyDatabase()
})
```

```js
// good
beforeAll(() => {
  createMyDatabase()
})
afterAll(() => {
  removeMyDatabase()
})
```
