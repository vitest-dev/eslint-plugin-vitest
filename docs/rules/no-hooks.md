# Disallow setup and teardown hooks (`vitest/no-hooks`)

<<<<<<< HEAD
⚠️ This rule _warns_ in the 🌐 `all` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
<!-- end auto-generated rule header -->

## Rule details

This rule reports for the following function calls:

- `beforeAll`
- `beforeEach`
- `afterAll`
- `afterEach`

Examples of **incorrect** code for this rule:

```js
/* eslint vitest/no-hooks: "error" */

function setupFoo(options) {
  /* ... */
}

function setupBar(options) {
  /* ... */
}

describe('foo', () => {
  let foo;

  beforeEach(() => {
    foo = setupFoo();
  });

  afterEach(() => {
    foo = null;
  });

  it('does something', () => {
    expect(foo.doesSomething()).toBe(true);
  });

  describe('with bar', () => {
    let bar;

    beforeEach(() => {
      bar = setupBar();
    });

    afterEach(() => {
      bar = null;
    });

    it('does something with bar', () => {
      expect(foo.doesSomething(bar)).toBe(true);
    });
  });
});
```

Examples of **correct** code for this rule:

```js
/* eslint vitest/no-hooks: "error" */

function setupFoo(options) {
  /* ... */
}

function setupBar(options) {
  /* ... */
}

describe('foo', () => {
  it('does something', () => {
    const foo = setupFoo();
    expect(foo.doesSomething()).toBe(true);
  });

  it('does something with bar', () => {
    const foo = setupFoo();
    const bar = setupBar();
    expect(foo.doesSomething(bar)).toBe(true);
  });
});
```

## Options

```json
{
  "vitest/no-hooks": [
    "error",
    {
      "allow": ["afterEach", "afterAll"]
    }
  ]
}
```

### `allow`

This array option controls which Vitest hooks are checked by this rule. There are
four possible values:

- `"beforeAll"`
- `"beforeEach"`
- `"afterAll"`
- `"afterEach"`

By default, none of these options are enabled (the equivalent of
`{ "allow": [] }`).

Examples of **incorrect** code for the `{ "allow": ["afterEach"] }` option:

```js
/* eslint vitest/no-hooks: ["error", { "allow": ["afterEach"] }] */

function setupFoo(options) {
  /* ... */
}

let foo;

beforeEach(() => {
  foo = setupFoo();
});

afterEach(() => {
  vi.resetModules();
});

test('foo does this', () => {
  // ...
});

test('foo does that', () => {
  // ...
});
```

Examples of **correct** code for the `{ "allow": ["afterEach"] }` option:

```js
/* eslint vitest/no-hooks: ["error", { "allow": ["afterEach"] }] */

function setupFoo(options) {
  /* ... */
}

afterEach(() => {
  vi.resetModules();
});

test('foo does this', () => {
  const foo = setupFoo();
  // ...
});

test('foo does that', () => {
  const foo = setupFoo();
  // ...
});
```