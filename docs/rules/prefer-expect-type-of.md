# Enforce using `expectTypeOf` instead of `expect(typeof ...)` (`@vitest/prefer-expect-type-of`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule enforces using Vitest's `expectTypeOf` function instead of `expect(typeof ...)` for type checking in tests.

## Rule Details

Vitest provides `expectTypeOf` as a more expressive and type-safe way to test types compared to using `expect(typeof ...)`. This rule automatically converts `expect(typeof value).toBe(type)` patterns to use the appropriate `expectTypeOf` matcher.

### Incorrect

```ts
import { test, expect } from 'vitest'

test('type checking', () => {
  expect(typeof 'hello').toBe('string')
  expect(typeof 42).toBe('number')
  expect(typeof true).toBe('boolean')
  expect(typeof {}).toBe('object')
  expect(typeof () => {}).toBe('function')
  expect(typeof Symbol()).toBe('symbol')
  expect(typeof 123n).toBe('bigint')
  expect(typeof undefined).toBe('undefined')
})
```

### Correct

```ts
import { test, expectTypeOf } from 'vitest'

test('type checking', () => {
  expectTypeOf('hello').toBeString()
  expectTypeOf(42).toBeNumber()
  expectTypeOf(true).toBeBoolean()
  expectTypeOf({}).toBeObject()
  expectTypeOf(() => {}).toBeFunction()
  expectTypeOf(Symbol()).toBeSymbol()
  expectTypeOf(123n).toBeBigInt()
  expectTypeOf(undefined).toBeUndefined()
})
```