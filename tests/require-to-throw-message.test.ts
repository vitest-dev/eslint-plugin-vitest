import rule, { RULE_NAME } from '../src/rules/require-to-throw-message'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    "expect(() => { throw new Error('a'); }).toThrow('a');",
    "expect(() => { throw new Error('a'); }).toThrowError('a');",
    `
    test('string', async () => {
      const throwErrorAsync = async () => { throw new Error('a') };
      await expect(throwErrorAsync()).rejects.toThrow('a');
      await expect(throwErrorAsync()).rejects.toThrowError('a');
    })
     `,

    "const a = 'a'; expect(() => { throw new Error('a'); }).toThrow(`${a}`);",

    "const a = 'a'; expect(() => { throw new Error('a'); }).toThrowError(`${a}`);",
    `
    test('Template literal', async () => {
      const a = 'a';
      const throwErrorAsync = async () => { throw new Error('a') };
      await expect(throwErrorAsync()).rejects.toThrow(\`\${a}\`);
      await expect(throwErrorAsync()).rejects.toThrowError(\`\${a}\`);
    })
     `,

    // Regex
    "expect(() => { throw new Error('a'); }).toThrow(/^a$/);",
    "expect(() => { throw new Error('a'); }).toThrowError(/^a$/);",
    `
    test('Regex', async () => {
      const throwErrorAsync = async () => { throw new Error('a') };
      await expect(throwErrorAsync()).rejects.toThrow(/^a$/);
      await expect(throwErrorAsync()).rejects.toThrowError(/^a$/);
    })
     `,

    // Function
    "expect(() => { throw new Error('a'); }).toThrow((() => { return 'a'; })());",
    "expect(() => { throw new Error('a'); }).toThrowError((() => { return 'a'; })());",
    `
    test('Function', async () => {
      const throwErrorAsync = async () => { throw new Error('a') };
      const fn = () => { return 'a'; };
      await expect(throwErrorAsync()).rejects.toThrow(fn());
      await expect(throwErrorAsync()).rejects.toThrowError(fn());
    })
     `,

    // Allow no message for `not`.
    "expect(() => { throw new Error('a'); }).not.toThrow();",
    "expect(() => { throw new Error('a'); }).not.toThrowError();",
    `
    test('Allow no message for "not"', async () => {
      const throwErrorAsync = async () => { throw new Error('a') };
      await expect(throwErrorAsync()).resolves.not.toThrow();
      await expect(throwErrorAsync()).resolves.not.toThrowError();
    })
     `,
    'expect(a);',
  ],
  invalid: [
    {
      code: "expect(() => { throw new Error('a'); }).toThrow();",
      errors: [
        {
          messageId: 'addErrorMessage',
          data: { matcherName: 'toThrow' },
          column: 41,
          line: 1,
        },
      ],
    },
    {
      code: "expect(() => { throw new Error('a'); }).toThrowError();",
      errors: [
        {
          messageId: 'addErrorMessage',
          data: { matcherName: 'toThrowError' },
          column: 41,
          line: 1,
        },
      ],
    },
    {
      code: `
       test('empty rejects.toThrow', async () => {
      const throwErrorAsync = async () => { throw new Error('a') };
      await expect(throwErrorAsync()).rejects.toThrow();
      await expect(throwErrorAsync()).rejects.toThrowError();
       })
     `,
      errors: [
        {
          messageId: 'addErrorMessage',
          data: { matcherName: 'toThrow' },
          column: 47,
          line: 4,
        },
        {
          messageId: 'addErrorMessage',
          data: { matcherName: 'toThrowError' },
          column: 47,
          line: 5,
        },
      ],
    },
  ],
})
