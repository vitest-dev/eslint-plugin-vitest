import { createEslintRule } from '../utils'

const RULE_NAME = 'consistent-test-filename'

const defaultPattern = /.*\.test\.[tj]sx?$/
const defaultTestsPattern = /.*\.(test|spec)\.[tj]sx?$/

export default createEslintRule<
  [
    Partial<{
      pattern: string
      allTestPattern: string
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
          },
          allTestPattern: {
            type: 'string',
            format: 'regex',
          },
        },
      },
    ],
    defaultOptions: [
      {
        pattern: defaultPattern.source,
        allTestPattern: defaultTestsPattern.source,
      },
    ],
  },

  create: (context, options) => {
    const { pattern: patternRaw, allTestPattern: allTestPatternRaw } =
      options[0]

    const pattern = new RegExp(patternRaw!)
    const allTestPattern = new RegExp(allTestPatternRaw!)

    const { filename } = context

    if (!allTestPattern.test(filename)) return {}

    return {
      Program: (p) => {
        if (!pattern.test(filename)) {
          context.report({
            node: p,
            messageId: 'consistentTestFilename',
            data: {
              pattern: patternRaw,
            },
          })
        }
      },
    }
  },
})
