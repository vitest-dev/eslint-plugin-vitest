import rule, { RULE_NAME } from '../src/rules/prefer-mock-return-shorthand'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'describe()',
    'it()',
    'describe.skip()',
    'it.skip()',
    'test()',
    'test.skip()',
    'var appliedOnly = describe.only; appliedOnly.apply(describe)',
    'var calledOnly = it.only; calledOnly.call(it)',
    'it.each()()',
    'it.each`table`()',
    'test.each()()',
    'test.each`table`()',
    'test.concurrent()',
    'vi.fn().mockReturnValue(42)',
    'vi.fn(() => Promise.resolve(42))',
    'vi.fn(() => 42)',
    'vi.fn(() => ({}))',
    'aVariable.mockImplementation',
    'aVariable.mockImplementation()',
    `
      aVariable.mockImplementation(() => {
        if (true) {
          return 1;
        }

        return 2;
      });
    `,
    'aVariable.mockReturnValue()',
    'aVariable.mockReturnValue(1)',
    'aVariable.mockReturnValue("hello world")',
    "vi.spyOn(Thingy, 'method').mockImplementation(param => param * 2);",
    "vi.spyOn(Thingy, 'method').mockImplementation(param => true ? param : 0);",
    `
      aVariable.mockImplementation(() => {
        const value = new Date();

        return Promise.resolve(value);
      });
    `,
    `
      aVariable.mockImplementation(() => {
        throw new Error('oh noes!');
      });
    `,
    'aVariable.mockImplementation(() => { /* do something */ });',
    `
      aVariable.mockImplementation(() => {
        const x = 1;

        console.log(x + 2);
      });
    `,
    'aVariable.mockReturnValue(Promise.all([1, 2, 3]));',
  ],

  invalid: [
    {
      code: 'vi.fn().mockImplementation(() => "hello sunshine")',
      output: 'vi.fn().mockReturnValue("hello sunshine")',
      errors: [
        {
          messageId: 'useMockShorthand',
          data: { replacement: 'mockReturnValue' },
          column: 9,
          line: 1,
        },
      ],
    },
    ...['null', '0', 'Promise.resolve(42)', 'Promise.reject(13)', '[]'].flatMap(
      (value) => [
        {
          code: `vi.fn().mockImplementation(() => ${value})`,
          output: `vi.fn().mockReturnValue(${value})`,
          errors: [
            {
              messageId: 'useMockShorthand' as const,
              data: { replacement: 'mockReturnValue' },
              column: 9,
              line: 1,
            },
          ],
        },
        {
          code: `
            vi.fn().mockImplementation(() => {
              return ${value};
            })
          `.trim(),
          output: `vi.fn().mockReturnValue(${value})`,
          errors: [
            {
              messageId: 'useMockShorthand' as const,
              data: { replacement: 'mockReturnValue' },
              column: 9,
              line: 1,
            },
          ],
        },
        {
          code: `aVariable.mockImplementation(() => ${value})`,
          output: `aVariable.mockReturnValue(${value})`,
          errors: [
            {
              messageId: 'useMockShorthand' as const,
              data: { replacement: 'mockReturnValue' },
              column: 11,
              line: 1,
            },
          ],
        },
        {
          code: `
            aVariable.mockImplementation(() => {
              return ${value};
            })
          `.trim(),
          output: `aVariable.mockReturnValue(${value})`,
          errors: [
            {
              messageId: 'useMockShorthand' as const,
              data: { replacement: 'mockReturnValue' },
              column: 11,
              line: 1,
            },
          ],
        },
      ],
    ),

    {
      code: 'vi.fn().mockImplementation(() => ({}))',
      output: `vi.fn().mockReturnValue({})`,
      errors: [
        {
          messageId: 'useMockShorthand',
          data: { replacement: 'mockReturnValue' },
          column: 9,
          line: 1,
        },
      ],
    },
    {
      code: 'vi.fn().mockImplementation(() => x)',
      output: `vi.fn().mockReturnValue(x)`,
      errors: [
        {
          messageId: 'useMockShorthand',
          data: { replacement: 'mockReturnValue' },
          column: 9,
          line: 1,
        },
      ],
    },
    {
      code: 'vi.fn().mockImplementation(() => true ? x : y)',
      output: `vi.fn().mockReturnValue(true ? x : y)`,
      errors: [
        {
          messageId: 'useMockShorthand',
          data: { replacement: 'mockReturnValue' },
          column: 9,
          line: 1,
        },
      ],
    },
    {
      code: `
        vi.fn().mockImplementation(function () {
          return "hello world";
        })
      `.trim(),
      output: `vi.fn().mockReturnValue("hello world")`,
      errors: [
        {
          messageId: 'useMockShorthand',
          data: { replacement: 'mockReturnValue' },
          column: 9,
          line: 1,
        },
      ],
    },
    {
      code: 'vi.fn().mockImplementation(() => "hello world")',
      output: `vi.fn().mockReturnValue("hello world")`,
      errors: [
        {
          messageId: 'useMockShorthand',
          data: { replacement: 'mockReturnValue' },
          column: 9,
          line: 1,
        },
      ],
    },
    {
      code: `
        vi.fn().mockImplementation(() => {
          return "hello world";
        })
      `.trim(),
      output: `vi.fn().mockReturnValue("hello world")`,
      errors: [
        {
          messageId: 'useMockShorthand',
          data: { replacement: 'mockReturnValue' },
          column: 9,
          line: 1,
        },
      ],
    },
    {
      code: 'aVariable.mockImplementation(() => "hello world")',
      output: 'aVariable.mockReturnValue("hello world")',
      errors: [
        {
          messageId: 'useMockShorthand',
          data: { replacement: 'mockReturnValue' },
          column: 11,
          line: 1,
        },
      ],
    },
    {
      code: `
        aVariable.mockImplementation(() => {
          return "hello world";
        })
      `.trim(),
      output: 'aVariable.mockReturnValue("hello world")',
      errors: [
        {
          messageId: 'useMockShorthand',
          data: { replacement: 'mockReturnValue' },
          column: 11,
          line: 1,
        },
      ],
    },

    {
      code: 'vi.fn().mockImplementationOnce(() => "hello world")',
      output: `vi.fn().mockReturnValueOnce("hello world")`,
      errors: [
        {
          messageId: 'useMockShorthand',
          data: { replacement: 'mockReturnValueOnce' },
          column: 9,
          line: 1,
        },
      ],
    },
    {
      code: 'aVariable.mockImplementationOnce(() => "hello world")',
      output: `aVariable.mockReturnValueOnce("hello world")`,
      errors: [
        {
          messageId: 'useMockShorthand',
          data: { replacement: 'mockReturnValueOnce' },
          column: 11,
          line: 1,
        },
      ],
    },
    {
      code: `
        aVariable.mockImplementation(() => ({
          target: 'world',
          message: 'hello'
        }))
      `.trim(),
      output: `
        aVariable.mockReturnValue({
          target: 'world',
          message: 'hello'
        })
      `.trim(),
      errors: [
        {
          messageId: 'useMockShorthand',
          data: { replacement: 'mockReturnValue' },
          column: 11,
          line: 1,
        },
      ],
    },
    {
      code: `
        aVariable
          .mockImplementation(() => 42)
          .mockImplementation(() => Promise.resolve(42))
          .mockReturnValue("hello world")
      `.trim(),
      output: `
        aVariable
          .mockReturnValue(42)
          .mockReturnValue(Promise.resolve(42))
          .mockReturnValue("hello world")
      `.trim(),
      errors: [
        {
          messageId: 'useMockShorthand',
          data: { replacement: 'mockReturnValue' },
          column: 12,
          line: 2,
        },
        {
          messageId: 'useMockShorthand',
          data: { replacement: 'mockReturnValue' },
          column: 12,
          line: 3,
        },
      ],
    },
    {
      code: `
        aVariable
          .mockImplementationOnce(() => Promise.reject(42))
          .mockImplementation(() => "hello sunshine")
          .mockReturnValueOnce(Promise.reject(42))
      `.trim(),
      output: `
        aVariable
          .mockReturnValueOnce(Promise.reject(42))
          .mockReturnValue("hello sunshine")
          .mockReturnValueOnce(Promise.reject(42))
      `.trim(),
      errors: [
        {
          messageId: 'useMockShorthand',
          data: { replacement: 'mockReturnValueOnce' },
          column: 12,
          line: 2,
        },
        {
          messageId: 'useMockShorthand',
          data: { replacement: 'mockReturnValue' },
          column: 12,
          line: 3,
        },
      ],
    },
    {
      code: 'vi.fn().mockImplementation(() => [], xyz)',
      output: 'vi.fn().mockReturnValue([], xyz)',
      errors: [
        {
          messageId: 'useMockShorthand',
          data: { replacement: 'mockReturnValue' },
          column: 9,
          line: 1,
        },
      ],
    },
    {
      code: 'vi.spyOn(fs, "readFile").mockImplementation(() => new Error("oh noes!"))',
      output: `vi.spyOn(fs, "readFile").mockReturnValue(new Error("oh noes!"))`,
      errors: [
        {
          messageId: 'useMockShorthand',
          data: { replacement: 'mockReturnValue' },
          column: 26,
          line: 1,
        },
      ],
    },
    {
      code: `
        aVariable.mockImplementation(() => {
          return Promise.resolve(value)
            .then(value => value + 1);
        });
      `.trim(),
      output: `
        aVariable.mockReturnValue(Promise.resolve(value)
            .then(value => value + 1));
      `.trim(),
      errors: [
        {
          messageId: 'useMockShorthand',
          data: { replacement: 'mockReturnValue' },
          column: 11,
          line: 1,
        },
      ],
    },
    {
      code: `
        aVariable.mockImplementation(() => {
          return Promise.all([1, 2, 3]);
        });
      `.trim(),
      output: 'aVariable.mockReturnValue(Promise.all([1, 2, 3]));',
      errors: [
        {
          messageId: 'useMockShorthand',
          data: { replacement: 'mockReturnValue' },
          column: 11,
          line: 1,
        },
      ],
    },
  ],
})
