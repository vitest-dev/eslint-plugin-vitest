# Disallow string interpolation in snapshots (`vitest/no-interpolation-in-snapshots`)

<<<<<<< HEAD
⚠️ This rule _warns_ in the 🌐 `all` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
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