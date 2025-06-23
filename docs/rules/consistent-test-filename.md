# Require .spec test file pattern (`@vitest/consistent-test-filename`)

⚠️ This rule _warns_ in the `legacy-all` config.

<!-- end auto-generated rule header -->

### Rule Details

#### Options

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
