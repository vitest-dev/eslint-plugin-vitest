import rule, { RULE_NAME } from '../src/rules/no-large-snapshots'
import { ruleTester } from './ruleTester'

const generateSnaShotLines = (lines: number) => `\`\n${'line\n'.repeat(lines)}\``

const generateExportsSnapshotString = (
  lines: number,
  title = 'a big component 1'
) => `exports[\`${title}\`] = ${generateSnaShotLines(lines - 1)};`

const generateExpectInlineSnapsCode = (
  lines: number,
  matcher: 'toMatchInlineSnapshot' | 'toThrowErrorMatchingInlineSnapshot'
) => `expect(something).${matcher}(${generateSnaShotLines(lines)});`

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
  ]
})
