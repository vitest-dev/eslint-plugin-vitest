import rule from '../src/rules/prefer-expect-resolves'
import { ruleTester } from './ruleTester'

const messageId = 'expectResolves'

ruleTester.run(rule.name, rule, {
  valid: [
    'expect.hasAssertions()',
    `it('passes', async () => {
     await expect(someValue()).resolves.toBe(true);
      });`,
    `it('is true', async () => {
          const myPromise = Promise.resolve(true);

          await expect(myPromise).resolves.toBe(true);
        });
      `,
    `it('errors', async () => {
          await expect(Promise.reject(new Error('oh noes!'))).rejects.toThrowError(
            'oh noes!',
          );
       });`,
    'expect().nothing();',
  ],
  invalid: [
    {
      code: "it('passes', async () => { expect(await someValue()).toBe(true); });",
      output:
        "it('passes', async () => { await expect(someValue()).resolves.toBe(true); });",
      errors: [
        {
          messageId,
        },
      ],
    },
    {
      code: "it('is true', async () => { const myPromise = Promise.resolve(true); expect(await myPromise).toBe(true); });",
      output:
        "it('is true', async () => { const myPromise = Promise.resolve(true); await expect(myPromise).resolves.toBe(true); });",
      errors: [
        {
          messageId,
          endColumn: 92,
          column: 77,
        },
      ],
    },
  ],
})
