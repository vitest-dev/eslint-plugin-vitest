import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import rule, { RULE_NAME } from '../src/rules/expect-expect'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'test.skip("skipped test", () => {})',
    'it.todo("will test something eventually")',
    'test.todo("will test something eventually")',
    '[\'x\']();',
    'it("should pass", () => expect(true).toBeDefined())',
    'test("should pass", () => expect(true).toBeDefined())',
    'it("should pass", () => somePromise().then(() => expect(true).toBeDefined()))',
    'it("should pass", myTest); function myTest() { expect(true).toBeDefined() }',
    `test('assert', () => {
  assert('foo' !== 'bar', 'foo should not be equal to bar')
})`,
    `test('cleanPrCommitTitle', () => {
  const clean = 'Something done';
  assert.equal(cleanPrCommitTitle('Something done (#123)', 123), clean);
  assert.equal(cleanPrCommitTitle('  Something done  (#123)  ', 123), clean);
  assert.equal(cleanPrCommitTitle(' Something done ', 123), clean);

  assert.notEqual(cleanPrCommitTitle('Something done (fixes #123)', 123), clean);
  assert.notEqual(cleanPrCommitTitle('Something done (#23454)', 123), clean);
});`,
    `import { it as base } from 'vitest'

const it = base.extend<{
  foo: string,
  bar: string
} >({
 async foo({}, use) {
   await use('foo')
 },
 async bar({}, use) {
   await use('bar')
 }
})`,
    `
it('example', async () => {
  const result = Promise.reject<string>('error');

  await expect(result.then((it) => it.toUpperCase())).rejects.toThrow();
});`
  ],
  invalid: [
    {
      code: 'it("should fail", () => {});',
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: 'it("should fail", myTest); function myTest() {}',
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: 'test("should fail", () => {});',
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: 'afterEach(() => {});',
      options: [{ additionalTestBlockFunctions: ['afterEach'] }],
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: `
    theoretically('the number {input} is correctly translated to string', theories, theory => {
     const output = NumberToLongString(theory.input);
    })
    `,
      options: [{ additionalTestBlockFunctions: ['theoretically'] }],
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: 'it("should fail", () => { somePromise.then(() => {}); });',
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: 'test("should fail", () => { foo(true).toBe(true); })',
      options: [{ assertFunctionNames: ['expect'] }],
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: 'it("should also fail",() => expectSaga(mySaga).returns());',
      options: [{ assertFunctionNames: ['expect'] }],
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: 'test(\'should fail\', () => request.get().foo().expect(456));',
      options: [{ assertFunctionNames: ['request.*.expect'] }],
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: 'test(\'should fail\', () => request.get().foo().bar().expect(456));',
      options: [{ assertFunctionNames: ['request.foo**.expect'] }],
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: 'test(\'should fail\', () => tester.request(123));',
      options: [{ assertFunctionNames: ['request.*'] }],
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: 'test(\'should fail\', () => request(123));',
      options: [{ assertFunctionNames: ['request.*'] }],
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: 'test(\'should fail\', () => request(123));',
      options: [{ assertFunctionNames: ['request.**'] }],
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: `
    import { test as checkThat } from 'vitest';

    checkThat('this passes', () => {
     // ...
    });
    `,
      languageOptions: { parserOptions: { sourceType: 'module' } },
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: `
    it("should fail 'expectTypeOf' without 'typecheck' enabled", () => {
     expectTypeOf({ a: 1 }).toEqualTypeOf<{ a: number }>()
    });
    `,
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: `
    it("should fail 'assertType' without 'typecheck' enabled", () => {
     assertType<string>('a')
    });
    `,
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: `
     import { it } from 'vitest';
     const myExtendedTest = it.extend({
       fixture: [
         async ({}, use) => {
           // this function will run
           setup()
           await use()
           teardown()
         },
         { auto: true }
       ],
     })
     myExtendedTest("should still fail when using the extended test", ()=> {
       // ...
     })
       `,
      options: [{ additionalTestBlockFunctions: ['myExtendedTest'] }],
      languageOptions: { parserOptions: { sourceType: 'module' } },
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    }
  ]
})
