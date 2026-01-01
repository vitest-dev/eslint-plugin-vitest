import type { TSESLint } from '@typescript-eslint/utils'
import rule from '../src/rules/padding-around-before-each-blocks'
import { ruleTester } from './ruleTester'

const testCase = {
  code: `
const someText = 'abc';
beforeEach(() => {
});
describe('someText', () => {
  const something = 'abc';
  // A comment
  beforeEach(() => {
    // stuff
  });
  beforeEach(() => {
    // other stuff
  });
});

describe('someText', () => {
  const something = 'abc';
  beforeEach(() => {
    // stuff
  });
});
`,
  output: `
const someText = 'abc';

beforeEach(() => {
});

describe('someText', () => {
  const something = 'abc';

  // A comment
  beforeEach(() => {
    // stuff
  });

  beforeEach(() => {
    // other stuff
  });
});

describe('someText', () => {
  const something = 'abc';

  beforeEach(() => {
    // stuff
  });
});
`,
  errors: [
    {
      messageId: 'missingPadding',
      line: 3,
      column: 1,
    },
    {
      messageId: 'missingPadding',
      line: 5,
      column: 1,
    },
    {
      messageId: 'missingPadding',
      line: 8,
      column: 3,
    },
    {
      messageId: 'missingPadding',
      line: 11,
      column: 3,
    },
    {
      messageId: 'missingPadding',
      line: 18,
      column: 3,
    },
  ],
} satisfies TSESLint.InvalidTestCase<'missingPadding', never>

ruleTester.run(rule.name, rule, {
  valid: [testCase.output],
  invalid: ['src/component.test.jsx', 'src/component.test.js'].map(
    (filename) => ({ ...testCase, filename }),
  ),
})
