# prefer-hooks-in-order

⚠️ This rule _warns_ in the 🌍 `legacy-all` config.

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
