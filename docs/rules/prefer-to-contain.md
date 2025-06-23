# prefer-to-contain

⚠️ This rule _warns_ in the 🌍 `legacy-all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->


This rule triggers a warning if `toBe()`, `toEqual()` or `toStrickEqual()` is used to assert object inclusion in an array.


The following patterns are considered warnings:


```ts
expect(a.includes(b)).toBe(true);
expect(a.includes(b)).toEqual(true);
expect(a.includes(b)).toStrictEqual(true);
```


The following patterns are not considered warnings:

```ts
expect(a).toContain(b);
```