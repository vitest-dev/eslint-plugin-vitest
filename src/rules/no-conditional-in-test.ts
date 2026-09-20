import { createEslintRule } from '../utils'
import {
  VitestFnCallParser,
} from '../utils/parse-vitest-fn-call'

const RULE_NAME = 'no-conditional-in-test'
export type MESSAGE_IDS = 'noConditionalInTest'
export type Options = []

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'disallow conditional tests',
      requiresTypeChecking: false,
      recommended: false,
    },
    messages: {
      noConditionalInTest: 'Remove conditional tests',
    },
    schema: [],
    type: 'problem',
  },
  create(context) {
    const vitestFnCallParser = new VitestFnCallParser()
    return {
      IfStatement(node) {
        if (
          node.parent?.parent?.parent?.type === 'CallExpression' &&
          vitestFnCallParser.isTypeOfVitestFnCall(
            node.parent?.parent?.parent,
            context,
            ['test', 'it'],
          )
        ) {
          context.report({
            messageId: 'noConditionalInTest',
            node,
          })
        }
      },
    }
  },
})
