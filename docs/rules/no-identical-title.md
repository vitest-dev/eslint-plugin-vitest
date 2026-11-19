# vitest/no-identical-title

📝 Disallow identical titles.

💼⚠️ This rule is enabled in the ✅ `recommended` config. This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rationale

Tests or suites with the same title in the same scope are hard to tell apart in reports and failure messages, and the duplicate is often a copy-paste mistake where one of them was meant to test something else. Snapshot names are also derived from test titles, so duplicates make snapshots depend on test order.

## Rule Details

Examples of **incorrect** code for this rule:

```js
it('is awesome', () => {
  /* ... */
})

it('is awesome', () => {
  /* ... */
})
```

Examples of **correct** code for this rule:

```js
it('is awesome', () => {
  /* ... */
})

it('is very awesome', () => {
  /* ... */
})
```
