import rule, { RULE_NAME } from '../src/rules/no-identical-title'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
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
	  });`
  ],
  invalid: [
    {
      code: `describe('foo', () => {
						  it('works', () => {});
						  it('works', () => {});
						});`,
      errors: [{ messageId: 'multipleTestTitle' }]
    },
    {
      code: `xdescribe('foo', () => {
						  it('works', () => {});
						  it('works', () => {});
					  });`,
      errors: [{ messageId: 'multipleTestTitle' }]
    }
  ]
})
