# prefer-spy-on

⚠️ This rule _warns_ in the 💾 `legacy-all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule details

This rule triggers a warning if an object's property is overwritten with a vitest mock.

```ts
Date.now = vi.fn();
Date.now = vi.fn(() => 10);
```

These patterns would not be considered warnings:

```ts
vi.spyOn(Date, 'now');
vi.spyOn(Date, 'now').mockImplementation(() => 10);
```
