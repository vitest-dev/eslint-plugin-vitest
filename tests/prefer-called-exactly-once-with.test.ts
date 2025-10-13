import rule, { RULE_NAME } from '../src/rules/prefer-called-exactly-once-with'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'expect(fn).toHaveBeenCalledExactlyOnceWith();',
    'expect(x).toHaveBeenCalledExactlyOnceWith(args);',
    'expect(x).toHaveBeenCalledOnce();',
    `expect(x).toHaveBeenCalledWith('hoge');`,
    `
      expect(x).toHaveBeenCalledOnce();
      expect(y).toHaveBeenCalledWith('hoge');
    `,
    `
    expect(x).toHaveBeenCalledOnce();
    expect(x).not.toHaveBeenCalledWith('hoge');
    `,
    `
    expect(x).not.toHaveBeenCalledOnce();
    expect(x).toHaveBeenCalledWith('hoge');
    `,
    `
    expect(x).not.toHaveBeenCalledOnce();
    expect(x).not.toHaveBeenCalledWith('hoge');
    `,
    `
    expect(x).toHaveBeenCalledOnce();
    x.mockRestore();
    expect(x).toHaveBeenCalledWith('hoge');
    `,
    `
    expect(x).toHaveBeenCalledOnce();
    x.mockReset();
    expect(x).toHaveBeenCalledWith('hoge');
    `,
    `
    expect(x).toHaveBeenCalledOnce();
    x.mockClear();
    expect(x).toHaveBeenCalledWith('hoge');
    `,
    `
    expect(x).toHaveBeenCalledOnce();
    y.mockClear();
    expect(y).toHaveBeenCalledWith('hoge');
    `,
  ],
  invalid: [
    {
      code: `
      expect(x).toHaveBeenCalledOnce();
      expect(x).toHaveBeenCalledWith('hoge');
      `,
      errors: [
        {
          messageId: 'preferCalledExactlyOnceWith',
          data: { matcherName: 'toHaveBeenCalledWith' },
          column: 17,
          line: 3,
        },
      ],
      output: `
      expect(x).toHaveBeenCalledExactlyOnceWith('hoge');
      `,
    },
    {
      code: `
      expect(x).toHaveBeenCalledWith('hoge');
      expect(x).toHaveBeenCalledOnce();
      `,
      errors: [
        {
          messageId: 'preferCalledExactlyOnceWith',
          data: { matcherName: 'toHaveBeenCalledOnce' },
          column: 17,
          line: 3,
        },
      ],
      output: `
      expect(x).toHaveBeenCalledExactlyOnceWith('hoge');
      `,
    },
    {
      code: `
      expect(x).toHaveBeenCalledWith('hoge', 123);
      expect(x).toHaveBeenCalledOnce();
      `,
      errors: [
        {
          messageId: 'preferCalledExactlyOnceWith',
          data: { matcherName: 'toHaveBeenCalledOnce' },
          column: 17,
          line: 3,
        },
      ],
      output: `
      expect(x).toHaveBeenCalledExactlyOnceWith('hoge', 123);
      `,
    },
    {
      code: `
      test('example',() => {
        expect(x).toHaveBeenCalledWith('hoge', 123);
        expect(x).toHaveBeenCalledOnce();
      });
      `,
      errors: [
        {
          messageId: 'preferCalledExactlyOnceWith',
          data: { matcherName: 'toHaveBeenCalledOnce' },
          column: 19,
          line: 4,
        },
      ],
      output: `
      test('example',() => {
        expect(x).toHaveBeenCalledExactlyOnceWith('hoge', 123);
      });
      `,
    },
    {
      code: `
      expect(x).toHaveBeenCalledWith('hoge', 123);
      expect(x).toHaveBeenCalledOnce();
      expect(y).toHaveBeenCalledWith('foo', 456);
      expect(y).toHaveBeenCalledOnce();
      `,
      errors: [
        {
          messageId: 'preferCalledExactlyOnceWith',
          data: { matcherName: 'toHaveBeenCalledOnce' },
          column: 17,
          line: 3,
        },
        {
          messageId: 'preferCalledExactlyOnceWith',
          data: { matcherName: 'toHaveBeenCalledOnce' },
          column: 17,
          line: 5,
        },
      ],
      output: `
      expect(x).toHaveBeenCalledExactlyOnceWith('hoge', 123);
      expect(y).toHaveBeenCalledExactlyOnceWith('foo', 456);
      `,
    },
    {
      code: `
      expect(x).toHaveBeenCalledWith('hoge', 123);
      const hoge = 'foo';
      expect(x).toHaveBeenCalledOnce();
      `,
      errors: [
        {
          messageId: 'preferCalledExactlyOnceWith',
          data: { matcherName: 'toHaveBeenCalledOnce' },
          column: 17,
          line: 4,
        },
      ],
      output: `
      expect(x).toHaveBeenCalledExactlyOnceWith('hoge', 123);
      const hoge = 'foo';
      `,
    },
    {
      code: `
      expect(x).toHaveBeenCalledOnce();
      y.mockClear();
      expect(x).toHaveBeenCalledWith('hoge');
      `,
      errors: [
        {
          messageId: 'preferCalledExactlyOnceWith',
          data: { matcherName: 'toHaveBeenCalledWith' },
          column: 17,
          line: 4,
        },
      ],
      output: `
      expect(x).toHaveBeenCalledExactlyOnceWith('hoge');
      y.mockClear();
      `,
    },
  ],
})
