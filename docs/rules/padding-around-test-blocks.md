# vitest/padding-around-test-blocks

📝 Enforce padding around `test` blocks.

⚠️ This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule enforces a line of padding before _and_ after 1 or more `test/it`
statements.

Note that it doesn't add/enforce a padding line if it's the last statement in
its scope.

### Options

<!-- begin auto-generated rule options list -->

| Name                           | Description                                                 | Type     | Default |
| :----------------------------- | :---------------------------------------------------------- | :------- | :------ |
| `additionalTestBlockFunctions` | Additional functions that should be treated as test blocks. | String[] | `[]`    |

<!-- end auto-generated rule options list -->

If you wrap `test`/`it` in your own function, list its name under
`additionalTestBlockFunctions` so the rule pads around calls to it as well:

```json
{
  "vitest/padding-around-test-blocks": [
    "error",
    {
      "additionalTestBlockFunctions": ["myCustomTest"]
    }
  ]
}
```

```js
const someText = 'hoge'

myCustomTest('hoge', () => {})

myCustomTest('foo', () => {})
```

Examples of **incorrect** code for this rule:

```js
const someText = 'hoge'
test('hoge', () => {})
test('foo', () => {})
```

```js
const someText = 'hoge'
it('hoge', () => {})
it('foo', () => {})
```

Examples of **correct** code for this rule:

```js
const someText = 'hoge'

test('hoge', () => {})

test('foo', () => {})
```

```js
const someText = 'hoge'

it('hoge', () => {})

it('foo', () => {})
```
