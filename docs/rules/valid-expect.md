# vitest/valid-expect

📝 Enforce valid `expect()` usage.

💼⚠️ This rule is enabled in the ✅ `recommended` config. This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule triggers a warning if `expect` is called with no argument or with more than one argument. You change that behavior by setting the `minArgs` and `maxArgs` options.

### Options

<!-- begin auto-generated rule options list -->

| Name            | Description                                          | Type     | Default                   |
| :-------------- | :--------------------------------------------------- | :------- | :------------------------ |
| `alwaysAwait`   | Require awaiting every async assertion.              | Boolean  | `false`                   |
| `asyncMatchers` | Matchers that should be considered async assertions. | String[] | [`toReject`, `toResolve`] |
| `maxArgs`       | Maximum number of arguments allowed for `expect`.    | Number   | `1`                       |
| `minArgs`       | Minimum number of arguments allowed for `expect`.    | Number   | `1`                       |

<!-- end auto-generated rule options list -->

1. `alwaysAwait`

- Type: `boolean`
- Default: `false`

- Enforce `expect` to be called with an `await` expression.

  ```js
  // ✅ good
  await expect(Promise.resolve(1)).resolves.toBe(1)
  await expect(Promise.reject(1)).rejects.toBe(1)

  // ❌ bad
  expect(Promise.resolve(1)).resolves.toBe(1)
  expect(Promise.reject(1)).rejects.toBe(1)
  ```

2. `asyncMatchers`

- Type: `string[]`
- Default: `[]`

```js
{
	"vitest/valid-expect": ["error", {
	  "asyncMatchers": ["toBeResolved", "toBeRejected"]
	}]
}
```

avoid using asyncMatchers with `expect`:

3. `minArgs`

- Type: `number`
- Default: `1`

- Enforce `expect` to be called with at least `minArgs` arguments.

  ```js
  // ✅ good
  expect(1).toBe(1)
  expect(1, 2).toBe(1)
  expect(1, 2, 3).toBe(1)

  // ❌ bad
  expect().toBe(1)
  expect(1).toBe()
  ```

4. `maxArgs`

- Type: `number`
- Default: `1`

- Enforce `expect` to be called with at most `maxArgs` arguments.
- Exception: `expect(value, "message")` is allowed.

  ```js
  // ✅ good
  expect(1).toBe(1)
  expect(1, 'expect value to be one').toBe(1)
  const message = 'expect value to be one'
  expect(1, `Error Message: ${message}`).toBe(1)

  // ❌ bad
  expect(1, 2, 3, 4).toBe(1)
  ```
