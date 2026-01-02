# vitest/no-interpolation-in-snapshots

📝 Disallow string interpolation in snapshots.

💼⚠️ This rule is enabled in the ✅ `recommended` config. This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to prevent the use of string interpolation in snapshots.

### Fail

```ts
expect('foo').toMatchSnapshot(`${bar}`)
expect('foo').toMatchSnapshot(`foo ${bar}`)
```

### Pass

```ts
expect('foo').toMatchSnapshot()
expect('foo').toMatchSnapshot('foo')
expect('foo').toMatchSnapshot(bar)
```
