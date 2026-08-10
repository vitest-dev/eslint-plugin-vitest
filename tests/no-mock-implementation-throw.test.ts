import rule from '../src/rules/no-mock-implementation-throw'
import { ruleTester } from './ruleTester'

ruleTester.run(rule.name, rule, {
  valid: [
    'describe()',
    'it()',
    'test()',
    'vi.fn()',
    'vi.fn().mockThrow(new Error("oh noes!"))',
    'vi.fn().mockThrowOnce(new Error("oh noes!"))',
    'aVariable.mockImplementation',
    'aVariable.mockImplementation()',
    // not a single `throw` statement
    'vi.fn().mockImplementation(() => 42)',
    'vi.fn().mockImplementation(() => { return 42; })',
    'vi.fn().mockImplementation(() => {})',
    `
      aVariable.mockImplementation(() => {
        console.log('about to explode');

        throw new Error('oh noes!');
      });
    `,
    `
      aVariable.mockImplementation(() => {
        if (someCondition) {
          throw new Error('oh noes!');
        }
      });
    `,
    `
      aVariable.mockImplementation(() => {
        try {
          doSomething();
        } catch {
          throw new Error('oh noes!');
        }
      });
    `,
    // an async function rejects rather than throws
    {
      code: 'vi.fn().mockImplementation(async () => { throw new Error("oh noes!"); })',
      languageOptions: { parserOptions: { ecmaVersion: 2017 } },
    },
    {
      code: 'vi.fn().mockImplementationOnce(async function () { throw new Error("oh noes!"); })',
      languageOptions: { parserOptions: { ecmaVersion: 2017 } },
    },
    // a generator doesn't throw until it is iterated
    'vi.fn().mockImplementation(function* () { throw new Error("oh noes!"); })',
    // the implementation uses its parameters
    'vi.fn().mockImplementation(param => { throw new Error(param); })',
    'vi.fn().mockImplementation(function (param) { throw new Error(param); })',
    // the thrown value is a mutable variable
    `
      let error = new Error('oh noes!');
      vi.fn().mockImplementation(() => {
        throw error;
      });
    `,
    `
      var error = new Error('oh noes!');
      vi.fn().mockImplementation(() => {
        throw error;
      });
    `,
    'vi.fn().mockImplementation(() => { throw x++; })',
  ],

  invalid: [
    {
      code: 'vi.fn().mockImplementation(() => { throw new Error("oh noes!"); })',
      output: 'vi.fn().mockThrow(new Error("oh noes!"))',
      errors: [
        {
          messageId: 'useMockThrow',
          data: { replacement: 'mockThrow' },
          column: 9,
          line: 1,
        },
      ],
    },
    {
      code: 'vi.fn().mockImplementationOnce(() => { throw new Error("oh noes!"); })',
      output: 'vi.fn().mockThrowOnce(new Error("oh noes!"))',
      errors: [
        {
          messageId: 'useMockThrow',
          data: { replacement: 'mockThrowOnce' },
          column: 9,
          line: 1,
        },
      ],
    },
    {
      code: 'aVariable.mockImplementation(function () { throw new Error("oh noes!"); })',
      output: 'aVariable.mockThrow(new Error("oh noes!"))',
      errors: [
        {
          messageId: 'useMockThrow',
          data: { replacement: 'mockThrow' },
          column: 11,
          line: 1,
        },
      ],
    },
    ...['"oh noes!"', 'error', 'new TypeError("nope")', '{ code: 42 }'].map(
      (value) => ({
        code: `aVariable.mockImplementation(() => { throw ${value}; })`,
        output: `aVariable.mockThrow(${value})`,
        errors: [
          {
            messageId: 'useMockThrow' as const,
            data: { replacement: 'mockThrow' },
            column: 11,
            line: 1,
          },
        ],
      }),
    ),
    {
      code: `
        const error = new Error('oh noes!');
        vi.fn().mockImplementation(() => {
          throw error;
        });
      `.trim(),
      output: `
        const error = new Error('oh noes!');
        vi.fn().mockThrow(error);
      `.trim(),
      errors: [
        {
          messageId: 'useMockThrow',
          data: { replacement: 'mockThrow' },
          column: 17,
          line: 2,
        },
      ],
    },
    {
      code: `
        vi.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
          throw new Error('oh noes!');
        })
      `.trim(),
      output: `vi.spyOn(fs, 'readFileSync').mockThrowOnce(new Error('oh noes!'))`,
      errors: [
        {
          messageId: 'useMockThrow',
          data: { replacement: 'mockThrowOnce' },
          column: 30,
          line: 1,
        },
      ],
    },
    {
      code: `
        aVariable
          .mockImplementation(() => { throw new Error('one'); })
          .mockImplementation(async () => { throw new Error('two'); })
          .mockImplementationOnce(() => { throw new Error('three'); })
      `.trim(),
      output: `
        aVariable
          .mockThrow(new Error('one'))
          .mockImplementation(async () => { throw new Error('two'); })
          .mockThrowOnce(new Error('three'))
      `.trim(),
      errors: [
        {
          messageId: 'useMockThrow',
          data: { replacement: 'mockThrow' },
          column: 12,
          line: 2,
        },
        {
          messageId: 'useMockThrow',
          data: { replacement: 'mockThrowOnce' },
          column: 12,
          line: 4,
        },
      ],
    },
  ],
})
