# Disallow the use of certain matchers (`vitest/no-restricted-matchers`)

⚠️ This rule _warns_ in the `all-legacy` config.

<!-- end auto-generated rule header -->

### Rule Details

This rule disallows the use of certain matchers.


### Forexample


### Options

```json
{
  "vitest/no-restricted-matchers": [
	"error",
	{
	  "not": null,
	}
  ]
}
```

Examples of **incorrect** code for this rule with the above configuration

```js
expect(a).not.toBe(b)
```

Examples of **correct** code for this rule with the above configuration

```js
expect(a).toBe(b)
```