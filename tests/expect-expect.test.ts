import rule, { RULE_NAME } from '../src/rules/expect-expect'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      code: 'test("shows success", () => {expectValue(true).toBe(false);});',
      options: [{ customExpressions: ['expectValue'] }]
    },
	{
		code: `test("shows success", () => {
		  expect(true);
		  expect.assertions(1);
		});`,
		options: [{ customExpressions: ['expect','expect.*'] }]
	},
    {
      code: `test("shows success", () => {
        mySecondExpression(true).toBe(true);});`,
      options: [
        { customExpressions: ['expectValue', 'mySecondExpression'] }
      ]
    },
	{
		code: 'test.skip("shows success", () => {});'
	}
  ],
  invalid: [
    {
      code: 'test("shows error", () => {});',
      errors: [{ messageId: 'expectedExpect' }]
    }
  ]
})

 ruleTester.run(RULE_NAME, rule, {
  valid: [
    `test("shows error", () => {
          expect(true).toBe(false);
        });`,
    `it("foo", function () {
          expect(true).toBe(false);
        })`,
    `it('foo', () => {
          expect(true).toBe(false);
        });
        function myTest() { if ('bar') {} }`,
    `function myTest(param) {}
        describe('my test', () => {
          it('should do something', () => {
            myTest("num");
            expect(1).toEqual(1);
          });
        });`,
    `const myFunc = () => {};
        it("works", () => expect(myFunc()).toBe(undefined));`,
    `describe('title', () => {
          it('test is not ok', () => {
            [1, 2, 3, 4, 5, 6].forEach((n) => {
            expect(n).toBe(1);
            });
          });
          });`,
    `describe('title', () => {
          test('some test', () => {
            expect(obj1).not.toEqual(obj2);
          })
          })`,
    'it("should pass", () => expect(true).toBeDefined())',
    `const myFunc = () => {};
        it("works", () => expect(myFunc()).toBe(undefined));`,
    `const myFunc = () => {};
        it("works", () => expect(myFunc()).toBe(undefined));`,
		'it.skip("should also pass",() => {})'
  ],
  invalid: [
    {
      code: `it("foo", function () {
            if (1 === 2) {}
          })`,
      errors: [{ messageId: 'expectedExpect' }]
    },
    {
      code: `import { it } from 'vitest';
          describe('Button with increment', () => {
            it('should show name props', () => {
              console.log('test with missing expect');
            });
          });`,
      errors: [{ messageId: 'expectedExpect' }]
    },
    {
      code: 'it("should also fail",() => expectSaga(mySaga).returns());',
      errors: [{ messageId: 'expectedExpect' }]
    }
  ]
 })
