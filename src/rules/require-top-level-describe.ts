import { createEslintRule } from '../utils'
import { isTypeOfVitestFnCall, parseVitestFnCall } from '../utils/parse-vitest-fn-call'

export const RULE_NAME = 'require-top-level-describe'

type MESSAGE_IDS =
  | 'tooManyDescribes'
  | 'unexpectedTestCase'
  | 'unexpectedHook'

type Options = [Partial<{ maxNumberOfTopLevelDescribes: number }>]

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'enforce that all tests are in a top-level describe',
      recommended: false
    },
    messages: {
      tooManyDescribes:
        'There should not be more than {{ max }} describe{{ s }} at the top level',
      unexpectedTestCase: 'All test cases must be wrapped in a describe block.',
      unexpectedHook: 'All hooks must be wrapped in a describe block.'
    },
    type: 'suggestion',
    schema: [
      {
        type: 'object',
        properties: {
          maxNumberOfTopLevelDescribes: {
            type: 'number',
            minimum: 1
          }
        },
        additionalProperties: false
      }
    ]
  },
  defaultOptions: [{}],
  create(context) {
    const { maxNumberOfTopLevelDescribes = Infinity } = context.options[0] ?? {}

    let numberOfTopLevelDescribeBlocks = 0
    let numberOfDescribeBlocks = 0
    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (!vitestFnCall) return

        if (vitestFnCall.type === 'describe') {
          numberOfDescribeBlocks++

          if (numberOfDescribeBlocks === 1) {
            numberOfTopLevelDescribeBlocks++
            if (numberOfTopLevelDescribeBlocks > maxNumberOfTopLevelDescribes) {
              context.report({
                node,
                messageId: 'tooManyDescribes',
                data: {
                  max: maxNumberOfTopLevelDescribes,
                  s: maxNumberOfTopLevelDescribes === 1 ? '' : 's'
                }
              })
            }
          }
          return
        }

        if (numberOfDescribeBlocks === 0) {
          if (vitestFnCall.type === 'test') {
            context.report({ node, messageId: 'unexpectedTestCase' })
            return
          }

          if (vitestFnCall.type === 'hook')
            context.report({ node, messageId: 'unexpectedHook' })
        }
      },
      'CallExpression:exit'(node) {
        if (isTypeOfVitestFnCall(node, context, ['describe']))
          numberOfDescribeBlocks--
      }
    }
  }
})
