import { createEslintRule } from '../utils'

export const RULE_NAME = 'consistent-test-filename'

const defaultPattern = /.*\.test\.[tj]sx?$/
const defaultTestsPattern = /.*\.(test|spec)\.[tj]sx?$/

export default createEslintRule<
  [
    Partial<{
      pattern: RegExp | string
      allTestPattern: RegExp | string
    }>,
  ],
  'consistentTestFilename'
>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      recommended: false,
      requiresTypeChecking: false,
      description: 'require test file pattern',
    },
    messages: {
      consistentTestFilename: 'Use test file name pattern {{ pattern }}',
    },
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          pattern: {
            type: 'string',
            format: 'regex',
            default: defaultPattern.source,
          },
          allTestPattern: {
            type: 'string',
            format: 'regex',
            default: defaultTestsPattern.source,
          },
        },
      },
    ],
  },
  defaultOptions: [
    {
      pattern: defaultPattern,
      allTestPattern: defaultTestsPattern,
    },
  ],

  create: (context, options) => {
    const { pattern: patternRaw, allTestPattern: allTestPatternRaw } =
      options[0]

    const pattern =
      typeof patternRaw === 'string' ? new RegExp(patternRaw) : patternRaw!
    const testPattern =
      typeof allTestPatternRaw === 'string'
        ? new RegExp(allTestPatternRaw)
        : allTestPatternRaw!

    const { filename } = context

    if (!testPattern.test(filename)) return {}

    return {
      Program: (p) => {
        if (!pattern.test(filename)) {
          context.report({
            node: p,
            messageId: 'consistentTestFilename',
            data: {
              pattern: pattern.source,
            },
          })
        }
      },
    }
  },
})
