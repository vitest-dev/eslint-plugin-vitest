# Disallow duplicate hooks and teardown hooks (`vitest/no-duplicate-hooks`)

<<<<<<< HEAD
⚠️ This rule _warns_ in the 🌐 `all` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
<!-- end auto-generated rule header -->

## Rule Details

This rule aims to prevent duplicate hooks and teardown hooks.

Examples of **incorrect** code for this rule:

```ts

test('foo', () => {
  beforeEach(() => {})
  beforeEach(() => {}) // duplicate beforeEach
})
```

Examples of **correct** code for this rule:

```ts
test('foo', () => {
  beforeEach(() => {})
})
```

