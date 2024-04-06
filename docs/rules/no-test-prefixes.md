# Disallow using `test` as a prefix (`vitest/no-test-prefixes`)

<<<<<<< HEAD
⚠️ This rule _warns_ in the 🌐 `all` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

Examples of **incorrect** code for this rule:

```js
xdescribe.each([])("foo", function () {})
```

Examples of **correct** code for this rule:

```js
describe.skip.each([])("foo", function () {})
```
