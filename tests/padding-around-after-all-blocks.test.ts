import { ruleTester } from "./ruleTester"
import rule, { RULE_NAME } from "../src/rules/padding-around-after-all-blocks"
import { TSESLint } from "@typescript-eslint/utils";

const testCase = {
  code: `
const someText = 'abc';
afterAll(() => {
});
describe('someText', () => {
  const something = 'abc';
  // A comment
  afterAll(() => {
    // stuff
  });
  afterAll(() => {
    // other stuff
  });
});

describe('someText', () => {
  const something = 'abc';
  afterAll(() => {
    // stuff
  });
});
`,
  output: `
const someText = 'abc';

afterAll(() => {
});

describe('someText', () => {
  const something = 'abc';

  // A comment
  afterAll(() => {
    // stuff
  });

  afterAll(() => {
    // other stuff
  });
});

describe('someText', () => {
  const something = 'abc';

  afterAll(() => {
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
} satisfies TSESLint.InvalidTestCase<'missingPadding', never>;

ruleTester.run(RULE_NAME, rule, {
  valid: [testCase.output],
  invalid: ['src/component.test.jsx', 'src/component.test.js'].map(
    filename => ({ ...testCase, filename }),
  ),
})
