# vitest/prefer-lowercase-title

📝 Enforce lowercase titles.

⚠️ This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

Examples of **incorrect** code for this rule:

```js
test('It works', () => {
  // ...
})
```

Examples of **correct** code for this rule:

```js
test('it works', () => {
  // ...
})
```

### Options

<!-- begin auto-generated rule options list -->

| Name                          | Description                                                  | Type     |
| :---------------------------- | :----------------------------------------------------------- | :------- |
| `allowedPrefixes`             | Title prefixes that are exempt from this rule.               | String[] |
| `ignore`                      | Functions whose titles should be ignored when checking case. | String[] |
| `ignoreTopLevelDescribe`      | Ignore the first top-level `describe` title.                 | Boolean  |
| `lowercaseFirstCharacterOnly` | Only require the first character to be lowercase.            | Boolean  |

<!-- end auto-generated rule options list -->

```json
{
  "type": "object",
  "properties": {
    "ignore": {
      "type": "array",
      "items": {
        "enum": ["describe", "test", "it"]
      },
      "additionalProperties": false
    },
    "allowedPrefixes": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "additionalItems": false
    },
    "ignoreTopLevelDescribe": {
      "type": "boolean",
      "default": false
    },
    "lowercaseFirstCharacterOnly": {
      "type": "boolean",
      "default": true
    }
  },
  "additionalProperties": false
}
```
