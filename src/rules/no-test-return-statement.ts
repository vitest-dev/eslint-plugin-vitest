import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getTestCallbackArg, isFunction } from '../utils'
import {
  getTestCallExpressionsFromDeclaredVariables,
  isTypeOfVitestFnCall,
} from '../utils/parse-vitest-fn-call'

const RULE_NAME = 'no-test-return-statement'
export type MessageIds = 'noTestReturnStatement'
type Options = []

const getBody = (node: TSESTree.CallExpression) => {
  const callback = getTestCallbackArg(node)

  if (
    callback &&
    isFunction(callback) &&
    callback.body.type === AST_NODE_TYPES.BlockStatement
  )
    return callback.body.body
  return []
}

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow return statements in tests',
      recommended: false,
    },
    schema: [],
    messages: {
      noTestReturnStatement: 'Return statements are not allowed in tests',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        if (!isTypeOfVitestFnCall(node, context, ['test'])) return

        const body = getBody(node)
        const returnStmt = body.find(
          (stmt) => stmt.type === AST_NODE_TYPES.ReturnStatement,
        )

        if (!returnStmt) return

        context.report({
          messageId: 'noTestReturnStatement',
          node: returnStmt,
        })
      },
      FunctionDeclaration(node) {
        const declaredVariables = context.sourceCode.getDeclaredVariables(node)
        const testCallExpressions = getTestCallExpressionsFromDeclaredVariables(
          declaredVariables,
          context,
        )

        if (testCallExpressions.length === 0) return

        const returnStmt = node.body.body.find(
          (stmt) => stmt.type === AST_NODE_TYPES.ReturnStatement,
        )

        if (!returnStmt) return

        context.report({
          messageId: 'noTestReturnStatement',
          node: returnStmt,
        })
      },
    }
  },
})
