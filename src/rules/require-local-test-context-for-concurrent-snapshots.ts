import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { createEslintRule, isSupportedAccessor } from '../utils'
import { isTypeOfVitestFnCall } from '../utils/parse-vitest-fn-call'

export const RULE_NAME = 'require-local-test-context-for-concurrent-snapshots'

export default createEslintRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'require local Test Context for concurrent snapshot tests',
      recommended: 'strict'
    },
    messages: {
      requireLocalTestContext: 'Use local Test Context instead'
    },
    type: 'problem',
    schema: []
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const isNotAnAssertion = !isTypeOfVitestFnCall(node, context, ['expect'])
        if (isNotAnAssertion) return

        const isNotASnapshotAssertion = ![
          'toMatchSnapshot',
          'toMatchInlineSnapshot',
          'toMatchFileSnapshot',
          'toThrowErrorMatchingSnapshot',
          'toThrowErrorMatchingInlineSnapshot'
          //@ts-ignore
        ].includes(node.callee?.property.name)

        if (isNotASnapshotAssertion) return

        const isInsideSequentialDescribeOrTest = !context.sourceCode.getAncestors(node).some((ancestor) => {
          if (ancestor.type !== AST_NODE_TYPES.CallExpression) return false

          const isNotInsideDescribeOrTest = !isTypeOfVitestFnCall(ancestor, context, ['describe', 'test'])
          if (isNotInsideDescribeOrTest) return false

          const isTestRunningConcurrently
            = ancestor.callee.type === AST_NODE_TYPES.MemberExpression
            && isSupportedAccessor(ancestor.callee.property, 'concurrent')

          return isTestRunningConcurrently
        })

        if (isInsideSequentialDescribeOrTest) return

        context.report({
          node,
          messageId: 'requireLocalTestContext'
        })
      }
    }
  }
})
