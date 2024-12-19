import rule, { RULE_NAME } from '../src/rules/padding-around-all'
import { ruleTester } from './ruleTester'
import { InvalidTestCase } from '@typescript-eslint/rule-tester'

const testCase = {
  code: `
const someText = 'abc';
afterAll(() => {
});
describe('someText', () => {
  const something = 'abc';
  // A comment
  afterAll(() => {
    // stuff
  });
  afterAll(() => {
    // other stuff
  });
});

describe('someText', () => {
  const something = 'abc';
  afterAll(() => {
    // stuff
  });
});
`,
  output: `
const someText = 'abc';

afterAll(() => {
});

describe('someText', () => {
  const something = 'abc';

  // A comment
  afterAll(() => {
    // stuff
  });

  afterAll(() => {
    // other stuff
  });
});

describe('someText', () => {
  const something = 'abc';

  afterAll(() => {
    // stuff
  });
});
`,
  errors: [
    {
      messageId: 'missingPadding',
      line: 3,
      column: 1
    },
    {
      messageId: 'missingPadding',
      line: 5,
      column: 1
    },
    {
      messageId: 'missingPadding',
      line: 8,
      column: 3
    },
    {
      messageId: 'missingPadding',
      line: 11,
      column: 3
    },
    {
      messageId: 'missingPadding',
      line: 18,
      column: 3
    }
  ]
} satisfies InvalidTestCase<'missingPadding', never>

ruleTester.run(RULE_NAME, rule, {
  valid: [
    testCase.output,
    `
      xyz:
      afterEach(() => {});
    `
  ],
  invalid: [
    {
      code: `
        const someText = 'abc';
        xyz:
        afterEach(() => {});
      `,
      output: `
        const someText = 'abc';

        xyz:
        afterEach(() => {});
      `,
      errors: [
        {
          messageId: 'missingPadding',
          line: 3,
          column: 9
        }
      ]
    },
    {
      code: `
        const expr = 'Papayas';
        beforeEach(() => {});
        it('does something?', () => {
          switch (expr) {
            case 'Oranges':
              expect(expr).toBe('Oranges');
              break;
            case 'Mangoes':
            case 'Papayas':
              const v = 1;
              expect(v).toBe(1);
              console.log('Mangoes and papayas are $2.79 a pound.');
              // Expected output: "Mangoes and papayas are $2.79 a pound."
              break;
            default:
              console.log(\`Sorry, we are out of $\{expr}.\`);
          }
        });
      `,
      output: `
        const expr = 'Papayas';

        beforeEach(() => {});

        it('does something?', () => {
          switch (expr) {
            case 'Oranges':
              expect(expr).toBe('Oranges');

              break;
            case 'Mangoes':
            case 'Papayas':
              const v = 1;

              expect(v).toBe(1);

              console.log('Mangoes and papayas are $2.79 a pound.');
              // Expected output: "Mangoes and papayas are $2.79 a pound."
              break;
            default:
              console.log(\`Sorry, we are out of $\{expr}.\`);
          }
        });
      `,
      errors: [
        {
          messageId: 'missingPadding',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 30
        },
        {
          messageId: 'missingPadding',
          line: 4,
          column: 9,
          endLine: 19,
          endColumn: 12
        },
        {
          messageId: 'missingPadding',
          line: 8,
          column: 15,
          endLine: 8,
          endColumn: 21
        },
        {
          messageId: 'missingPadding',
          line: 12,
          column: 15,
          endLine: 12,
          endColumn: 33
        },
        {
          messageId: 'missingPadding',
          line: 13,
          column: 15,
          endLine: 13,
          endColumn: 69
        }
      ]
    }
  ]
})
