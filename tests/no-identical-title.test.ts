import rule, { RULE_NAME } from '../src/rules/no-identical-title'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    `suite('parent', () => {
            suite('child 1', () => {
     test('grand child 1', () => {})
         })
         suite('child 2', () => {
            test('grand child 1', () => {})
         })
        })`,
    'it(); it();',
    'test("two", () => {});',
    `fdescribe('a describe', () => {
  test('a test', () => {
   expect(true).toBe(true);
  });
  });
  fdescribe('another describe', () => {
  test('a test', () => {
   expect(true).toBe(true);
  });
  });`,
    `
  suite('parent', () => {
   suite('child 1', () => {
         test('grand child 1', () => {})
   }) 
   suite('child 2', () => {
    test('grand child 1', () => {})
   })
  })
  `,
    `
  test.each([1, 2])('%s', () => {
  })
  test.each([1, 2])('%s', () => {
  })
  `,
    `
  test.for([1,2])('%s', () => {
  })
  test.for([1,2])('%s', () => {
  })
  `,
  ],
  invalid: [
    {
      code: `describe('foo', () => {
     it('works', () => {});
     it('works', () => {});
   });`,
      errors: [{ messageId: 'multipleTestTitle' }],
    },
    {
      code: `xdescribe('foo', () => {
     it('works', () => {});
     it('works', () => {});
    });`,
      errors: [{ messageId: 'multipleTestTitle' }],
    },
  ],
})
