import rule, { RULE_NAME } from '../src/rules/padding-around-expect-groups'
import { ruleTester } from './ruleTester'
import { InvalidTestCase } from '@typescript-eslint/rule-tester'

const testCase = {
  code: `
foo();
bar();

const someText = 'abc';
const someObject = {
  one: 1,
  two: 2,
};

test('thing one', () => {
  let abc = 123;
  expect(abc).toEqual(123);
  expect(123).toEqual(abc); // Line comment
  abc = 456;
  expect(abc).toEqual(456);
});

test('thing one', () => {
  const abc = 123;
  expect(abc).toEqual(123);

  const xyz = 987;
  expect(123).toEqual(abc); // Line comment
});

describe('someText', () => {
  describe('some condition', () => {
    test('foo', () => {
      const xyz = 987;
      // Comment
      expect(xyz).toEqual(987);
      expect(1)
        .toEqual(1);
      expect(true).toEqual(true);
    });
  });
});

test('awaited expect', async () => {
  const abc = 123;
  const hasAPromise = () => Promise.resolve('foo');
  await expect(hasAPromise()).resolves.toEqual('foo');
  expect(abc).toEqual(123);

  const efg = 456;
  expect(123).toEqual(abc);
  await expect(hasAPromise()).resolves.toEqual('foo');

  const hij = 789;
  await expect(hasAPromise()).resolves.toEqual('foo');
  await expect(hasAPromise()).resolves.toEqual('foo');

  const somethingElseAsync = () => Promise.resolve('bar');
  await somethingElseAsync();
  await expect(hasAPromise()).resolves.toEqual('foo');
});

test('expectTypeOf test', () => {
  const hoge = 123;
  expectTypeOf(hoge).toBeNumber();
  expectTypeOf(hoge).toBeNumber();
  const foo = "abc";
  // Comment
  expectTypeOf(foo).toBeString();
  expectTypeOf(foo).toBeString();
});
`,
  output: `
foo();
bar();

const someText = 'abc';
const someObject = {
  one: 1,
  two: 2,
};

test('thing one', () => {
  let abc = 123;

  expect(abc).toEqual(123);
  expect(123).toEqual(abc); // Line comment

  abc = 456;

  expect(abc).toEqual(456);
});

test('thing one', () => {
  const abc = 123;

  expect(abc).toEqual(123);

  const xyz = 987;

  expect(123).toEqual(abc); // Line comment
});

describe('someText', () => {
  describe('some condition', () => {
    test('foo', () => {
      const xyz = 987;

      // Comment
      expect(xyz).toEqual(987);
      expect(1)
        .toEqual(1);
      expect(true).toEqual(true);
    });
  });
});

test('awaited expect', async () => {
  const abc = 123;
  const hasAPromise = () => Promise.resolve('foo');

  await expect(hasAPromise()).resolves.toEqual('foo');
  expect(abc).toEqual(123);

  const efg = 456;

  expect(123).toEqual(abc);
  await expect(hasAPromise()).resolves.toEqual('foo');

  const hij = 789;

  await expect(hasAPromise()).resolves.toEqual('foo');
  await expect(hasAPromise()).resolves.toEqual('foo');

  const somethingElseAsync = () => Promise.resolve('bar');
  await somethingElseAsync();

  await expect(hasAPromise()).resolves.toEqual('foo');
});

test('expectTypeOf test', () => {
  const hoge = 123;

  expectTypeOf(hoge).toBeNumber();
  expectTypeOf(hoge).toBeNumber();

  const foo = "abc";

  // Comment
  expectTypeOf(foo).toBeString();
  expectTypeOf(foo).toBeString();
});
`,
  errors: [
    {
      messageId: 'missingPadding',
      line: 13,
      column: 3
    },
    {
      messageId: 'missingPadding',
      line: 15,
      column: 3
    },
    {
      messageId: 'missingPadding',
      line: 16,
      column: 3
    },
    {
      messageId: 'missingPadding',
      line: 21,
      column: 3
    },
    {
      messageId: 'missingPadding',
      line: 24,
      column: 3
    },
    {
      messageId: 'missingPadding',
      line: 32,
      column: 7
    },
    {
      messageId: 'missingPadding',
      line: 43,
      column: 3
    },
    {
      messageId: 'missingPadding',
      line: 47,
      column: 3
    },
    {
      messageId: 'missingPadding',
      line: 51,
      column: 3
    },
    {
      messageId: 'missingPadding',
      line: 56,
      column: 3
    },
    {
      messageId: 'missingPadding',
      line: 61,
      column: 3
    },
    {
      messageId: 'missingPadding',
      line: 63,
      column: 3
    },
    {
      messageId: 'missingPadding',
      line: 65,
      column: 3
    }
  ]
} satisfies InvalidTestCase<'missingPadding', never>

ruleTester.run(RULE_NAME, rule, {
  valid: [testCase.output],
  invalid: ['src/component.test.jsx', 'src/component.test.js'].map(
    filename => ({ ...testCase, filename })
  )
})
