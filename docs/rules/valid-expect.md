# Enforce valid `expect()` usage (`vitest/valid-expect`)

<!-- end auto-generated rule header -->

This rule triggers a warning if `expect` is called with no argument or with more than one argument. You change that behavior by setting the `minArgs` and `maxArgs` options.

### Options

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

	```js
	// ✅ good
	expect(1).toBe(1)


	// ❌ bad
	expect(1, 2, 3, 4).toBe(1)
	```

