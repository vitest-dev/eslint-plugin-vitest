# Prefer test or it but not both (`vitest/consistent-test-it`)

⚠️ This rule _warns_ in the `all-legacy` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

### Rule Details

Examples of **incorrect** code for this rule:

```js
test('it works', () => {
	// ...
})

it('it works', () => {
	// ...
})
```

Examples of **correct** code for this rule:

```js
test('it works', () => {
	// ...
})
```

```js
test('it works', () => {
	// ...
})
```

#### Options

```json
{
   "type":"object",
   "properties":{
      "fn":{
         "enum":[
            "it",
            "test"
         ]
      },
      "withinDescribe":{
         "enum":[
            "it",
            "test"
         ]
      }
   },
   "additionalProperties":false
}
```

##### `fn`

Decides whether to prefer `test` or `it`.

##### `withinDescribe`

Decides whether to prefer `test` or `it` when used within a `describe` block.

```js
/*eslint vitest/consistent-test-it: ["error", {"fn": "test"}]*/

test('it works', () => { // <-- Valid
	// ...
})

test.only('it works', () => { // <-- Valid
	// ...
})


it('it works', () => { // <-- Invalid
	// ...
})

it.only('it works', () => { // <-- Invalid
	// ...
})
```

The default configuration is top level `test` and all tests nested with `describe` to use `it`.

