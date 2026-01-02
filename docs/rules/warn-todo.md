# vitest/warn-todo

📝 Disallow `.todo` usage.

<!-- end auto-generated rule header -->

## Rule Details

This rule should be used to trigger warnings when `.todo` is used in `describe`, `it`, or `test` functions. It is recommended to use this with GitHub Actions to annotate PR diffs.

You should never set this rule to `error` level, as it would prevent you from committing code that contains `.todo` usages. Instead, use it as a warning to remind you to remove `.todo` before merging or later.

Examples of **incorrect** code for this rule:

```js
describe.todo('foo', () => {})
it.todo('foo', () => {})
test.todo('foo', () => {})
```

Examples of **correct** code for this rule:

```js
describe([])('foo', () => {})
it([])('foo', () => {})
test([])('foo', () => {})
```
