import { TSESLint } from '@typescript-eslint/utils'
import { describe, expect, it } from 'vitest'
import { ruleTester } from '../utils/test'
import rule, { RULE_NAME } from './no-large-snapshots'

const generateSnaShotLines = (lines: number) =>
  `\`\n${'line\n'.repeat(lines)}\``

const generateExportsSnapshotString = (
  lines: number,
  title = 'a big component 1'
) => `exports[\`${title}\`] = ${generateSnaShotLines(lines - 1)};`

const generateExpectInlineSnapsCode = (
  lines: number,
  matcher: 'toMatchInlineSnapshot' | 'toThrowErrorMatchingInlineSnapshot'
) => `expect(something).${matcher}(${generateSnaShotLines(lines)});`

describe(RULE_NAME, () => {
  it(RULE_NAME, () => {
    ruleTester.run(RULE_NAME, rule, {
      valid: [
        'expect(something)',
        'expect(something).toBe(1)',
        'expect(something).toMatchInlineSnapshot',
        'expect(something).toMatchInlineSnapshot()',
        {
          filename: 'mock.js',
          code: generateExpectInlineSnapsCode(2, 'toMatchInlineSnapshot')
        },
        {
          filename: 'mock.jsx',
          code: generateExpectInlineSnapsCode(20, 'toMatchInlineSnapshot'),
          options: [
            {
              maxSize: 19,
              inlineMaxSize: 21
            }
          ]
        },
        {
          filename: 'mock.jsx',
          code: generateExpectInlineSnapsCode(60, 'toMatchInlineSnapshot'),
          options: [
            {
              maxSize: 61
            }
          ]
        },
        {
          // "it should not report snapshots that are allowed to be large"
          filename: '/mock-component.jsx.snap',
          code: generateExportsSnapshotString(58),
          options: [
            {
              allowedSnapshots: {
                '/mock-component.jsx.snap': ['a big component 1']
              }
            }
          ]
        }
      ],
      invalid: [
        {
          filename: 'mock.js',
          code: generateExpectInlineSnapsCode(50, 'toMatchInlineSnapshot'),
          errors: [
            {
              messageId: 'tooLongSnapShot',
              data: { lineLimit: 50, lineCount: 51 }
            }
          ]
        },
        {
          filename: 'mock.js',
          code: generateExpectInlineSnapsCode(
            50,
            'toThrowErrorMatchingInlineSnapshot'
          ),
          errors: [
            {
              messageId: 'tooLongSnapShot',
              data: { lineLimit: 50, lineCount: 51 }
            }
          ]
        },
        {
          filename: 'mock.js',
          code: generateExpectInlineSnapsCode(
            50,
            'toThrowErrorMatchingInlineSnapshot'
          ),
          options: [{ maxSize: 51, inlineMaxSize: 50 }],
          errors: [
            {
              messageId: 'tooLongSnapShot',
              data: { lineLimit: 50, lineCount: 51 }
            }
          ]
        },
        {
          // "should not report allowed large snapshots based on regexp"
          filename: '/mock-component.jsx.snap',
          code: [
            generateExportsSnapshotString(58, 'a big component w/ text'),
            generateExportsSnapshotString(58, 'a big component 2')
          ].join('\n\n'),
          options: [
            {
              allowedSnapshots: {
                '/mock-component.jsx.snap': [/a big component \d+/u]
              }
            }
          ],
          errors: [
            {
              messageId: 'tooLongSnapShot',
              data: { lineLimit: 50, lineCount: 58 }
            }
          ]
        }
      ]
    })
  })
})

describe(RULE_NAME, () => {
  describe('when "allowedSnapshots" options contains relative paths', () => {
    it('should throw an exception', () => {
      expect(() => {
        const linter = new TSESLint.Linter()

        linter.defineRule(RULE_NAME, rule)

        linter.verify(
          'console.log()',
          {
            rules: {
              'no-large-snapshots': [
                'error',
                {
                  allowedSnapshots: {
                    './mock-component.jsx.snap': [/a big component \d+/u]
                  }
                }
              ]
            }
          },
          'mock-component.jsx.snap'
        )
      }).toThrow(
        'All paths for allowedSnapshots must be absolute. You can use JS config and `path.resolve`'
      )
    })
  })
})
