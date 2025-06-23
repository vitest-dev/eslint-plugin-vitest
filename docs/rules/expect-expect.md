# Enforce having expectation in test body (`@vitest/expect-expect`)

<!-- end auto-generated rule header -->


## Rule Details

This rule aims to enforce having at least one expectation in test body to ensure that the test is actually testing something.

Examples of **incorrect** code for this rule:

```js
test('myLogic', () => {
	console.log('myLogic')
})

test('myLogic', () => {})
```

Examples of **correct** code for this rule:

```js
test('myLogic', () => {
  const actual = myLogic()
  expect(actual).toBe(true)
})
```

## Type-testing

If you're using Vitest's [type-testing feature](https://vitest.dev/guide/testing-types) and have tests that only contain `expectTypeOf`, you will need to enable `typecheck` in this plugin's settings: [Enabling type-testing](../../README.md#enabling-with-type-testing).

## Options

### `assertFunctionNames`

```json
{
  "vitest/expect-expect": [
    "error",
    {
      "assertFunctionNames": ["expect"],
      "additionalTestBlockFunctions": []
    }
  ]
}
```

An array of strings that are the names of the functions that are used for assertions. Function names can also be wildcard patterns like `expect*`,`function.**.expect` or `expect.anything`.


The following is an example of correct code for this rule with the option `assertFunctionNames`:

```js
import CheckForMe from 'check-for-me'
test('myLogic', () => {
 expect("myLogic").toBe("myOutput")
})
```


### `additionalTestBlockFunctions`


```json
{
  "rules": {
    "vitest/expect-expect": [
      "error",
      { "additionalTestBlockFunctions": ["checkForMe"] }
    ]
  }
}
```

An array of strings that are the names of the functions that are used for test blocks. Function names can also be wildcard patterns like `describe*`,`function.**.describe` or `describe.anything`.

The following is an example of correct code for this rule with the option `additionalTestBlockFunctions`:

```js
import CheckForMe from 'check-for-me'
checkForMe('myLogic', () => {
  checkForMe('myLogic', () => {
	const actual = myLogic()
	expect(actual).toBe(true)
  })
})
```
