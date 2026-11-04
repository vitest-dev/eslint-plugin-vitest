import type { TSESLint } from '@typescript-eslint/utils'
import rule from '../src/rules/padding-around-test-blocks'
import { ruleTester } from './ruleTester'

const testCase = {
  code: `
const foo = 'bar';
const bar = 'baz';
it('foo', () => {
  // stuff
});
fit('bar', () => {
  // stuff
});
test('foo foo', () => {});
test('bar bar', () => {});

// Nesting
describe('other bar', () => {
  const thing = 123;
  test('is another bar w/ test', () => {
  });
  // With a comment
  it('is another bar w/ it', () => {
  });
  test.skip('skipping', () => {}); // Another comment
  it.skip('skipping too', () => {});
});xtest('weird', () => {});
test
  .skip('skippy skip', () => {});
xit('bar foo', () => {});
`,
  output: `
const foo = 'bar';
const bar = 'baz';

it('foo', () => {
  // stuff
});

fit('bar', () => {
  // stuff
});

test('foo foo', () => {});

test('bar bar', () => {});

// Nesting
describe('other bar', () => {
  const thing = 123;

  test('is another bar w/ test', () => {
  });

  // With a comment
  it('is another bar w/ it', () => {
  });

  test.skip('skipping', () => {}); // Another comment

  it.skip('skipping too', () => {});
});

xtest('weird', () => {});

test
  .skip('skippy skip', () => {});

xit('bar foo', () => {});
`,
  errors: [
    {
      messageId: 'missingPadding',
      line: 4,
      column: 1,
    },
    {
      messageId: 'missingPadding',
      line: 7,
      column: 1,
    },
    {
      messageId: 'missingPadding',
      line: 10,
      column: 1,
    },
    {
      messageId: 'missingPadding',
      line: 11,
      column: 1,
    },
    {
      messageId: 'missingPadding',
      line: 16,
      column: 3,
    },
    {
      messageId: 'missingPadding',
      line: 19,
      column: 3,
    },
    {
      messageId: 'missingPadding',
      line: 21,
      column: 3,
    },
    {
      messageId: 'missingPadding',
      line: 22,
      column: 3,
    },
    {
      messageId: 'missingPadding',
      line: 23,
      column: 4,
    },
    {
      messageId: 'missingPadding',
      line: 24,
      column: 1,
    },
    {
      messageId: 'missingPadding',
      line: 26,
      column: 1,
    },
  ],
} satisfies TSESLint.InvalidTestCase<'missingPadding', never>

ruleTester.run(rule.name, rule, {
  valid: [testCase.output],
  invalid: ['src/component.test.jsx', 'src/component.test.js'].map(
    (filename) => ({ ...testCase, filename }),
  ),
})

ruleTester.run(`${rule.name} (additionalTestBlockFunctions)`, rule, {
  valid: [
    // Padded, so there is nothing to report.
    {
      code: `
const foo = 'bar';

myCustomTest('foo', () => {});

myCustomTest('bar', () => {});
`,
      options: [{ additionalTestBlockFunctions: ['myCustomTest'] }],
    },
    // A name that is not listed keeps the previous behaviour.
    {
      code: `
const foo = 'bar';
myCustomTest('foo', () => {});
myCustomTest('bar', () => {});
`,
      options: [{ additionalTestBlockFunctions: ['someOtherTest'] }],
    },
    // Without the option the rule ignores custom names, as before.
    `
const foo = 'bar';
myCustomTest('foo', () => {});
`,
  ],
  invalid: [
    {
      code: `
const foo = 'bar';
myCustomTest('foo', () => {});
myCustomTest('bar', () => {});
await myCustomTest('baz', () => {});
test('builtin', () => {});
`,
      output: `
const foo = 'bar';

myCustomTest('foo', () => {});

myCustomTest('bar', () => {});

await myCustomTest('baz', () => {});

test('builtin', () => {});
`,
      options: [{ additionalTestBlockFunctions: ['myCustomTest'] }],
      errors: [
        { messageId: 'missingPadding', line: 3, column: 1 },
        { messageId: 'missingPadding', line: 4, column: 1 },
        { messageId: 'missingPadding', line: 5, column: 1 },
        { messageId: 'missingPadding', line: 6, column: 1 },
      ],
    },
  ],
})
