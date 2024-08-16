# Disallow specific `vi.` methods (`@vitest/no-restricted-vi-methods`)

⚠️ This rule _warns_ in the 🌐 `all` config.

<!-- end auto-generated rule header -->

You may wish to restrict the use of specific `vi` methods.

## Rule details

This rule checks for the usage of specific methods on the `vi` object, which
can be used to disallow certain patterns such as spies and mocks.

## Options

Restrictions are expressed in the form of a map, with the value being either a
string message to be shown, or `null` if a generic default message should be
used.

By default, this map is empty, meaning no `vi` methods are banned.

For example:

```json
{
  "vitest/no-restricted-vi-methods": [
    "error",
    {
      "advanceTimersByTime": null,
      "spyOn": "Don't use spies"
    }
  ]
}
```

Examples of **incorrect** code for this rule with the above configuration

```js
vi.useFakeTimers();
it('calls the callback after 1 second via advanceTimersByTime', () => {
  // ...

  vi.advanceTimersByTime(1000);

  // ...
});

test('plays video', () => {
  const spy = vi.spyOn(video, 'play');

  // ...
});
```