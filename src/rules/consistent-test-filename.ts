import * as path from 'node:path'
import { createEslintRule } from '../utils'

export const RULE_NAME = 'consistent-test-filename'

const defaultPattern = /.*\.test\.[tj]sx?$/
const defaultTestsPattern = /.*\.(test|spec)\.[tj]sx?$/

export default createEslintRule({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      recommended: 'error',
      requiresTypeChecking: false,
      description: 'forbidden .spec test file pattern'
    },
    messages: {
      msg: 'use test file name pattern {{pattern}}'
    },
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          pattern: {
            format: 'regex',
          },
          allTestPattern: {
            format: 'regex',
            default: defaultTestsPattern.source
          }
        }
      }
    ]
  },
  defaultOptions: [],

  create: (context) => {
    const config = context.options[0] ?? {}
    const { pattern: patternRaw = defaultPattern, allTestPattern: allTestPatternRaw = defaultTestsPattern } = config
    const pattern = typeof patternRaw === 'string' ? new RegExp(patternRaw) : patternRaw
    const testPattern = typeof allTestPatternRaw === 'string' ? new RegExp(allTestPatternRaw) : allTestPatternRaw

    const filename = path.basename(context.getFilename())
    if (!testPattern.test(filename))
      return {}

    return {
      Program: (p) => {
        if (!pattern.test(filename)) {
          context.report({
            node: p,
            messageId: 'msg',
            data: {
              pattern: pattern.source
            }
          })
        }
      }
    }
  }
})
