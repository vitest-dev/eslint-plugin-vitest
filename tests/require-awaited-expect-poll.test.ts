import rule, { RULE_NAME } from '../src/rules/require-awaited-expect-poll'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      name: 'awaited expect.poll',
      code: `
        test('should pass', async () => {
          await expect.poll(() => element).toBeInTheDocument();
        });
      `,
    },

    {
      name: 'awaited expect.element',
      code: `
        test('should pass', async () => {
          await expect.element(element).toBeInTheDocument();
        });
      `,
    },

    {
      name: 'non-poll method',
      code: `
        test('should pass', () => {
          expect.syncElement(element).toBeInTheDocument();
        });
      `,
    },

    {
      name: 'returned expect.poll',
      code: `
        test('should pass', () => {
          return expect.poll(() => element).toBeInTheDocument();
        });
      `,
    },

    {
      name: 'returned expect.element',
      code: `
        test('should pass', () => {
          return expect.element(element).toBeInTheDocument();
        });
      `,
    },

    {
      name: 'expect without method',
      code: `
        test('should pass', () => {
          return expect(true).toBe(true);
        });
      `,
    },

    {
      name: 'awaited inside SequenceExpression',
      code: `
        test('should pass', async () => {
          (sideEffect(), await expect.poll(() => element).toBeInTheDocument());
        });
      `,
    },

    {
      name: 'awaited outside SequenceExpression',
      code: `
        test('should pass', async () => {
          await (sideEffect(), expect.poll(() => element).toBeInTheDocument());
        });
      `,
    },

    {
      name: 'awaited outside multiple SequenceExpressions',
      code: `
        test('should pass', async () => {
          await (sideEffect(), (sideEffect(), (sideEffect(), expect.poll(() => element).toBeInTheDocument())));
        });
      `,
    },

    {
      name: 'returned from SequenceExpression',
      code: `
        test('should pass', () => {
          return (sideEffect(), expect.poll(() => element).toBeInTheDocument());
        });
      `,
    },
  ],
  invalid: [
    {
      name: 'expect.poll not awaited',
      code: `
        test('should fail', () => {
          expect.poll(() => element).toBeInTheDocument();
        });
      `,
      errors: [
        {
          messageId: 'notAwaited',
          data: { method: 'expect.poll' },
          line: 3,
          column: 11,
          endColumn: 22,
        },
      ],
    },

    {
      name: 'expect.element not awaited',
      code: `
        test('should fail', () => {
          expect.element(element).toBeInTheDocument();
        });
      `,
      errors: [
        {
          messageId: 'notAwaited',
          data: { method: 'expect.element' },
          line: 3,
          column: 11,
          endColumn: 25,
        },
      ],
    },

    {
      name: 'expect.poll not awaited - accessed with bracket notation',
      code: `
        test('should fail', () => {
          expect['poll'](() => element).toBeInTheDocument();
        });
      `,
      errors: [
        {
          messageId: 'notAwaited',
          data: { method: 'expect.poll' },
          line: 3,
          column: 11,
          endColumn: 25,
        },
      ],
    },

    {
      name: 'expect.element not awaited - accessed with bracket notation',
      code: `
        test('should fail', () => {
          expect['element'](element).toBeInTheDocument();
        });
      `,
      errors: [
        {
          messageId: 'notAwaited',
          data: { method: 'expect.element' },
          line: 3,
          column: 11,
          endColumn: 28,
        },
      ],
    },

    {
      name: 'expect.poll not awaited - inside SequenceExpression',
      code: `
        test('should fail', () => {
          (expect.poll(() => element).toBeInTheDocument(), expect(true).toBe(true));
        });
      `,
      errors: [
        {
          messageId: 'notAwaited',
          data: { method: 'expect.poll' },
          line: 3,
          column: 12,
          endColumn: 23,
        },
      ],
    },

    {
      name: 'expect.element not awaited - inside SequenceExpression',
      code: `
        test('should fail', () => {
          (expect.element(() => element).toBeInTheDocument(), expect(true).toBe(true));
        });
      `,
      errors: [
        {
          messageId: 'notAwaited',
          data: { method: 'expect.element' },
          line: 3,
          column: 12,
          endColumn: 26,
        },
      ],
    },

    {
      name: 'expect.poll returned as part of SequenceExpression',
      code: `
        test('should fail', () => {
          return (expect.poll(() => element).toBeInTheDocument(), expect(true).toBe(true));
        });
      `,
      errors: [
        {
          messageId: 'notAwaited',
          data: { method: 'expect.poll' },
          line: 3,
          column: 19,
          endColumn: 30,
        },
      ],
    },
  ],
})
