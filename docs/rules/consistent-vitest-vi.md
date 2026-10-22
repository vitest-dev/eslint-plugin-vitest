# vitest/consistent-vitest-vi

📝 Enforce using vitest or vi but not both.

⚠️ This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

Examples of **incorrect** code for this rule:

```js
vitest.mock('./src/calculator.ts', { spy: true })

vi.stubEnv('NODE_ENV', 'production')
```

Examples of **correct** code for this rule:

```js
vi.mock('./src/calculator.ts', { spy: true })

vi.stubEnv('NODE_ENV', 'production')
```

```js
vitest.mock('./src/calculator.ts', { spy: true })

vitest.stubEnv('NODE_ENV', 'production')
```

## Options

<!-- begin auto-generated rule options list -->

| Name | Description                           | Type   | Choices        | Default |
| :--- | :------------------------------------ | :----- | :------------- | :------ |
| `fn` | Preferred utility keyword to enforce. | String | `vi`, `vitest` | `vi`    |

<!-- end auto-generated rule options list -->

```json
{
  "type": "object",
  "properties": {
    "fn": {
      "enum": ["vi", "vitest"]
    }
  },
  "additionalProperties": false
}
```

### `fn`

Decides whether to prefer `vitest` or `vi`.

The default configuration is top level `vi`.
