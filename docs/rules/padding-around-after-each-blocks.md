# Enforce padding around `afterEach` blocks (`vitest/padding-around-after-each-blocks`)

⚠️ This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule enforces a line of padding before _and_ after 1 or more `afterEach`
statements.

Note that it doesn't add/enforce a padding line if it's the last statement in
its scope.

Examples of **incorrect** code for this rule:

```js
const someText = 'hoge';
afterEach(() => {});
describe('foo', () => {});
```

Examples of **correct** code for this rule:

```js
const someText = 'hoge';

afterEach(() => {});

describe('foo', () => {});
```
