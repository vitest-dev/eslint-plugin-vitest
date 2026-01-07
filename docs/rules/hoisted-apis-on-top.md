# vitest/hoisted-apis-on-top

📝 Enforce hoisted APIs to be on top of the file.

⚠️ This rule _warns_ in the 🌐 `all` config.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

## Rule Details

This rule disallows using APIs which are hoisted by vitest in positions where they look like runtime code.

Examples of **incorrect** code for this rule:

```js
if (condition) {
  vi.mock('some-module', () => {})
}
```

```js
if (condition) {
  vi.unmock('some-module', () => {})
}
```

```js
if (condition) {
  vi.hoisted(() => {})
}
```

```js
describe('suite', () => {
  it('test', async () => {
    vi.mock('some-module', () => {})

    const sm = await import('some-module')
    // ...
  })
})
```

Examples of **correct** code for this rule:

```js
vi.mock('some-module', () => {})

describe('suite', () => {
  it('test', async () => {
    const sm = await import('some-module')
    // ...
  })
})
```

```js
vi.unmock(() => {})

if (condition) {
  // ...
}
```

```js
vi.hoisted(() => {})

if (condition) {
  // ...
}
```
