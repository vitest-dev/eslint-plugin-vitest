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
    {
      code: "it('resolves', async () => { expect(await (cond ? p1 : p2)).toBe(1); });",
      output:
        "it('resolves', async () => { await expect(cond ? p1 : p2).resolves.toBe(1); });",
      errors: [
        {
          messageId,
        },
      ],
    },
    {
      code: "it('resolves', async () => { expect(await (p1 ?? p2)).toBe(1); });",
      output:
        "it('resolves', async () => { await expect(p1 ?? p2).resolves.toBe(1); });",
      errors: [
        {
          messageId,
        },
      ],
    },
    {
      code: "it('resolves', async () => { expect(await (p as Promise<number>)).toBe(1); });",
      output:
        "it('resolves', async () => { await expect(p as Promise<number>).resolves.toBe(1); });",
      errors: [
        {
          messageId,
        },
      ],
    },
    {
      code: "it('resolves', async () => { expect(await ((p))).toBe(1); });",
      output:
        "it('resolves', async () => { await expect(p).resolves.toBe(1); });",
      errors: [
        {
          messageId,
        },
      ],
    },
    {
      code: "it('resolves', async () => { expect(await (setup(), p)).toBe(1); });",
      output:
        "it('resolves', async () => { await expect((setup(), p)).resolves.toBe(1); });",
      errors: [
        {
          messageId,
        },
      ],
    },
  ],
})
