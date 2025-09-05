import rule, { RULE_NAME } from '../src/rules/hoisted-apis-on-top'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'vi.mock()',
    `
vi.hoisted();
import foo from 'bar';
    `,
    `
import foo from 'bar';
vi.unmock(baz);
    `,
    `const foo = await vi.hoisted(async () => {});`,
  ],
  invalid: [
    {
      code: `
if (foo) {
  vi.mock('foo', () => {});
}
      `,
      errors: [
        {
          messageId: 'hoistedApisOnTop',
          suggestions: [
            {
              messageId: 'suggestMoveHoistedApiToTop',
              output: `vi.mock('foo', () => {});

if (foo) {
  ;
}
      `,
            },
            {
              messageId: 'suggestReplaceMockWithDoMock',
              output: `
if (foo) {
  vi.doMock('foo', () => {});
}
      `,
            },
          ],
        },
      ],
    },

    {
      code: `
import foo from 'bar';

if (foo) {
  vi.hoisted();
}
    `,
      errors: [
        {
          messageId: 'hoistedApisOnTop',
          suggestions: [
            {
              messageId: 'suggestMoveHoistedApiToTop',
              output: `
import foo from 'bar';
vi.hoisted();

if (foo) {
  ;
}
    `,
            },
          ],
        },
      ],
    },

    {
      code: `
import foo from 'bar';

if (foo) {
  vi.unmock();
}
    `,
      errors: [
        {
          messageId: 'hoistedApisOnTop',
          suggestions: [
            {
              messageId: 'suggestMoveHoistedApiToTop',
              output: `
import foo from 'bar';
vi.unmock();

if (foo) {
  ;
}
    `,
            },
          ],
        },
      ],
    },

    {
      code: `
import foo from 'bar';

if (foo) {
  vi.mock();
}
    `,
      errors: [
        {
          messageId: 'hoistedApisOnTop',
          suggestions: [
            {
              messageId: 'suggestMoveHoistedApiToTop',
              output: `
import foo from 'bar';
vi.mock();

if (foo) {
  ;
}
    `,
            },
            {
              messageId: 'suggestReplaceMockWithDoMock',
              output: `
import foo from 'bar';

if (foo) {
  vi.doMock();
}
    `,
            },
          ],
        },
      ],
    },

    {
      code: `
if (shouldMock) {
  vi.mock(import('something'), () => bar);
}

import something from 'something';
      `,
      errors: [
        {
          messageId: 'hoistedApisOnTop',
          suggestions: [
            {
              messageId: 'suggestMoveHoistedApiToTop',
              output: `
if (shouldMock) {
  ;
}

import something from 'something';
vi.mock(import('something'), () => bar);
      `,
            },
            {
              messageId: 'suggestReplaceMockWithDoMock',
              output: `
if (shouldMock) {
  vi.doMock(import('something'), () => bar);
}

import something from 'something';
      `,
            },
          ],
        },
      ],
    },
  ],
})
