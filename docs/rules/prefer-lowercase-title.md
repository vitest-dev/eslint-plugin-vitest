# prefer-lowercase-title

⚠️ This rule _warns_ in the 🌍 `legacy-all` config.

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
      },
      "lowercaseFirstCharacterOnly":{
         "type":"boolean",
         "default":true
      }
   },
   "additionalProperties":false
}
```