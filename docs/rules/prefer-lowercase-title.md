# Enforce lowercase titles (`vitest/prefer-lowercase-title`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

Examples of **incorrect** code for this rule:

```js
test('IT WORKS', () => {
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

```json
{
   "type":"object",
   "properties":{
      "ignore":{
         "type":"array",
         "items":{
            "enum":[
               "describe",
               "test",
               "it"
            ]
         },
         "additionalProperties":false
      },
      "allowedPrefixes":{
         "type":"array",
         "items":{
            "type":"string"
         },
         "additionalItems":false
      },
      "ignoreTopLevelDescribe":{
         "type":"boolean",
         "default":false
      }
   },
   "additionalProperties":false
}
```