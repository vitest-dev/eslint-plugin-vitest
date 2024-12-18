import rule, { RULE_NAME } from '../src/rules/max-expects'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'test(\'should pass\')',
    'test(\'should pass\', () => {})',
    'test.skip(\'should pass\', () => {})',
    `test('should pass', () => {
      expect(true).toBeDefined();
      expect(true).toBeDefined();
      expect(true).toBeDefined();
      expect(true).toBeDefined();
      expect(true).toBeDefined();
    });`,
    `test('should pass', () => {
     expect(true).toBeDefined();
     expect(true).toBeDefined();
     expect(true).toBeDefined();
     expect(true).toBeDefined();
     expect(true).toBeDefined();
      });`,
    ` test('should pass', async () => {
     expect.hasAssertions();
   
     expect(true).toBeDefined();
     expect(true).toBeDefined();
     expect(true).toBeDefined();
     expect(true).toBeDefined();
     expect(true).toEqual(expect.any(Boolean));
      });`
  ],
  invalid: [
    {
      code: `test('should not pass', function () {
       expect(true).toBeDefined();
       expect(true).toBeDefined();
       expect(true).toBeDefined();
       expect(true).toBeDefined();
       expect(true).toBeDefined();
       expect(true).toBeDefined();
     });
      `,
      errors: [
        {
          messageId: 'maxExpect',
          line: 7,
          column: 8
        }
      ]
    },
    {
      code: `test('should not pass', () => {
      expect(true).toBeDefined();
      expect(true).toBeDefined();
      expect(true).toBeDefined();
      expect(true).toBeDefined();
      expect(true).toBeDefined();
      expect(true).toBeDefined();
    });
    test('should not pass', () => {
      expect(true).toBeDefined();
      expect(true).toBeDefined();
      expect(true).toBeDefined();
      expect(true).toBeDefined();
      expect(true).toBeDefined();
      expect(true).toBeDefined();
    });`,
      errors: [
        {
          messageId: 'maxExpect',
          line: 7,
          column: 7
        },
        {
          messageId: 'maxExpect',
          line: 15,
          column: 7
        }
      ]
    },
    {
      code: `test('should not pass', () => {
      expect(true).toBeDefined();
      expect(true).toBeDefined();
       });`,
      options: [
        {
          max: 1
        }
      ],
      errors: [
        {
          messageId: 'maxExpect',
          line: 3,
          column: 7
        }
      ]
    }
  ]
})
