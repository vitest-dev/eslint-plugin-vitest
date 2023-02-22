# Prefer test file pattern (`vitest/consistent-test-filename`)

<!-- end auto-generated rule header -->

### Rule Details

#### Options

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "pattern": {
      "format": "regex"
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

**required**

required testing pattern

`pattern` doesn't have a default value, you must provide one.
