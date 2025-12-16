import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'
import { createEslintRule, isFunction } from '../utils'

export const RULE_NAME = 'no-unneeded-async-expect-function'

const getAwaitedCallExpression = (
  expression: TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression,
): TSESTree.CallExpression | null => {
  if (!expression.async) {
    return null
  }

  if (
    expression.type === AST_NODE_TYPES.ArrowFunctionExpression &&
    expression.body.type === AST_NODE_TYPES.AwaitExpression &&
    expression.body.argument.type === AST_NODE_TYPES.CallExpression
  ) {
    return expression.body.argument
  }

  if (
    expression.body.type !== AST_NODE_TYPES.BlockStatement ||
    expression.body.body.length !== 1
  ) {
    return null
  }

  const [callback] = expression.body.body

  if (
    callback.type === AST_NODE_TYPES.ExpressionStatement &&
    callback.expression.type === AST_NODE_TYPES.AwaitExpression &&
    callback.expression.argument.type === AST_NODE_TYPES.CallExpression
  ) {
    return callback.expression.argument
  }

  return null
}

export default createEslintRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        'Disallow unnecessary async function wrapper for expected promises',
    },
    fixable: 'code',
    messages: {
      noAsyncWrapperForExpectedPromise: 'Unnecessary async function wrapper',
    },
    schema: [],
    type: 'suggestion',
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node: TSESTree.CallExpression) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (vitestFnCall?.type !== 'expect') {
          return
        }

        const { parent } = vitestFnCall.head.node

        if (parent?.type !== AST_NODE_TYPES.CallExpression) {
          return
        }

        const [awaitNode] = parent.arguments

        if (!awaitNode || !isFunction(awaitNode)) {
          return
        }

        const innerAsyncFuncCall = getAwaitedCallExpression(awaitNode)

        if (!innerAsyncFuncCall) {
          return
        }

        context.report({
          node: awaitNode,
          messageId: 'noAsyncWrapperForExpectedPromise',
          fix(fixer) {
            const { sourceCode } = context

            return [
              fixer.replaceTextRange(
                [awaitNode.range[0], awaitNode.range[1]],
                sourceCode.getText(innerAsyncFuncCall),
              ),
            ]
          },
        })
      },
    }
  },
})
