# vitest/consistent-test-filename

📝 Require test file pattern.

⚠️ This rule _warns_ in the 🌐 `all` config.

<!-- end auto-generated rule header -->

## Rule Details

### Options

<!-- begin auto-generated rule options list -->

| Name             | Description                                              | Type   |
| :--------------- | :------------------------------------------------------- | :----- |
| `allTestPattern` | Regex pattern used to identify all possible test files.  | String |
| `pattern`        | Regex pattern for files that should be treated as tests. | String |

<!-- end auto-generated rule options list -->

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "pattern": {
      "format": "regex",
      "default": ".*\\.test\\.[tj]sx?$"
    },
    "allTestPattern": {
      "format": "",
      "default": ".*\\.(test|spec)\\.[tj]sx?$"
    }
  }
}
```

##### `allTestPattern`

regex pattern for all tests files

Decides whether a file is a testing file.

##### `pattern`

required testing pattern

`pattern` doesn't have a default value, you must provide one.
