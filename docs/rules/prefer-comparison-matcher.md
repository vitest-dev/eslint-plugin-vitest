# Enforce using the built-in comparison matchers (`vitest/prefer-comparison-matcher`)

⚠️ This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule checks for comparisons in a test that could be replaced with one of the following built-in comparison matchers:

- `toBeGreaterThan`
- `toBeGreaterThanOrEqual`
- `toBeLessThan`
- `toBeLessThanOrEqual`

Examples of **incorrect** code for this rule:

```js
expect(x > 5).toBe(true);
expect(x < 7).not.toEqual(true);
expect(x <= y).toStrictEqual(true);
```

Examples of **correct** code for this rule:

```js
expect(x).toBeGreaterThan(5);
expect(x).not.toBeLessThanOrEqual(7);
expect(x).toBeLessThanOrEqual(y);

// special case - see below
expect(x < 'Carl').toBe(true);
// Rule only works on inters and big integers
```