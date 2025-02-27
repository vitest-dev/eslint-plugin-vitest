import * as path from 'node:path'
import { createEslintRule } from '../utils'

export const RULE_NAME = 'consistent-test-filename'

const defaultPattern = /.*\.test\.[tj]sx?$/
const defaultTestsPattern = /.*\.(test|spec)\.[tj]sx?$/

export default createEslintRule<
  [
    Partial<{
      pattern: string
      allTestPattern: string
    }>
  ],
  'consistentTestFilename'
>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      recommended: false,
      requiresTypeChecking: false,
      description: 'require .spec test file pattern'
    },
    messages: {
      consistentTestFilename: 'Use test file name pattern {{ pattern }}'
    },
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          pattern: {
            // @ts-ignore
            format: 'regex',
            default: defaultPattern.source
          },
          allTestPattern: {
            // @ts-ignore
            format: 'regex',
            default: defaultTestsPattern.source
          }
        }
      }
    ]
  },
  defaultOptions: [{ pattern: defaultTestsPattern.source, allTestPattern: defaultTestsPattern.source }],

  create: (context) => {
    const config = context.options[0] ?? {}
    const { pattern: patternRaw = defaultPattern, allTestPattern: allTestPatternRaw = defaultTestsPattern } = config
    const pattern = typeof patternRaw === 'string' ? new RegExp(patternRaw) : patternRaw
    const testPattern = typeof allTestPatternRaw === 'string' ? new RegExp(allTestPatternRaw) : allTestPatternRaw

    const { filename } = context

    if (!testPattern.test(filename))
      return {}

    return {
      Program: (p) => {
        if (!pattern.test(filename)) {
          context.report({
            node: p,
            messageId: 'consistentTestFilename',
            data: {
              pattern: pattern.source
            }
          })
        }
      }
    }
  }
})
