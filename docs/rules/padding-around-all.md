# vitest/padding-around-all

📝 Enforce padding around vitest functions.

⚠️ This rule _warns_ in the 🌐 `all` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This is a meta rule that simply enables all of the following rules:

- [padding-around-after-all-blocks](padding-around-after-all-blocks.md)
- [padding-around-after-each-blocks](padding-around-after-each-blocks.md)
- [padding-around-before-all-blocks](padding-around-before-all-blocks.md)
- [padding-around-before-each-blocks](padding-around-before-each-blocks.md)
- [padding-around-expect-groups](padding-around-expect-groups.md)
- [padding-around-describe-blocks](padding-around-describe-blocks.md)
- [padding-around-test-blocks](padding-around-test-blocks.md)

### Options

<!-- begin auto-generated rule options list -->

| Name                           | Description                                                 | Type     | Default |
| :----------------------------- | :---------------------------------------------------------- | :------- | :------ |
| `additionalTestBlockFunctions` | Additional functions that should be treated as test blocks. | String[] | `[]`    |

<!-- end auto-generated rule options list -->

This rule includes `padding-around-test-blocks`, so it takes the same
`additionalTestBlockFunctions` option. See
[padding-around-test-blocks](padding-around-test-blocks.md) for details.
