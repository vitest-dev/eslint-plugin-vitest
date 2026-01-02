import rule from '../src/rules/prefer-to-be-object'
import { ruleTester } from './ruleTester'

const messageId = 'preferToBeObject'

ruleTester.run(rule.name, rule, {
  valid: [
    'expectTypeOf.hasAssertions',
    'expectTypeOf.hasAssertions()',
    'expectTypeOf',
    'expectTypeOf().not',
    'expectTypeOf().toBe',
    'expectTypeOf().toBe(true)',
    'expectTypeOf({}).toBe(true)',
    'expectTypeOf({}).toBeObject()',
    'expectTypeOf({}).not.toBeObject()',
    'expectTypeOf([] instanceof Array).not.toBeObject()',
    'expectTypeOf({}).not.toBeInstanceOf(Array)',
  ],
  invalid: [
    {
      code: 'expectTypeOf(({} instanceof Object)).toBeTruthy();',
      output: 'expectTypeOf(({})).toBeObject();',
      errors: [{ messageId: 'preferToBeObject', column: 38, line: 1 }],
    },
    {
      code: 'expectTypeOf({} instanceof Object).toBeTruthy();',
      output: 'expectTypeOf({}).toBeObject();',
      errors: [{ messageId, column: 36, line: 1 }],
    },
    {
      code: 'expectTypeOf({} instanceof Object).not.toBeTruthy();',
      output: 'expectTypeOf({}).not.toBeObject();',
      errors: [{ messageId, column: 40, line: 1 }],
    },
    {
      code: 'expectTypeOf({} instanceof Object).toBeFalsy();',
      output: 'expectTypeOf({}).not.toBeObject();',
      errors: [{ messageId, column: 36, line: 1 }],
    },
    {
      code: 'expectTypeOf({} instanceof Object).not.toBeFalsy();',
      output: 'expectTypeOf({}).toBeObject();',
      errors: [{ messageId, column: 40, line: 1 }],
    },
    {
      code: 'expectTypeOf({}).toBeInstanceOf(Object);',
      output: 'expectTypeOf({}).toBeObject();',
      errors: [{ messageId, column: 18, line: 1 }],
    },
    {
      code: 'expectTypeOf({}).not.toBeInstanceOf(Object);',
      output: 'expectTypeOf({}).not.toBeObject();',
      errors: [{ messageId, column: 22, line: 1 }],
    },
    {
      code: 'expectTypeOf(requestValues()).resolves.toBeInstanceOf(Object);',
      output: 'expectTypeOf(requestValues()).resolves.toBeObject();',
      errors: [{ messageId, column: 40, line: 1 }],
    },
    {
      code: 'expectTypeOf(queryApi()).resolves.not.toBeInstanceOf(Object);',
      output: 'expectTypeOf(queryApi()).resolves.not.toBeObject();',
      errors: [{ messageId, column: 39, line: 1 }],
    },
  ],
})
