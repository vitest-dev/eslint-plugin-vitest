import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import {
  createEslintRule,
  getNodeName,
  isFunction,
  isIdentifier,
} from '../utils'
import { VitestFnCallParser } from '../utils/parse-vitest-fn-call'

const RULE_NAME = 'require-hook'
type MESSAGE_IDS = 'useHook'
type Options = [{ allowedFunctionCalls?: readonly string[] }]

const isVitestFnCall = (
  node: TSESTree.CallExpression,
  vitestFnCallParser: VitestFnCallParser,
) => {
  if (vitestFnCallParser.parseVitestFnCall(node)) return true

  return !!getNodeName(node)?.startsWith('vi')
}

const isNullOrUndefined = (node: TSESTree.Expression) => {
  return (
    (node.type === AST_NODE_TYPES.Literal && node.value === null) ||
    isIdentifier(node, 'undefined')
  )
}

const shouldBeInHook = (
  node: TSESTree.Node,
  allowedFunctionCalls: readonly string[] = [],
  vitestFnCallParser: VitestFnCallParser,
): boolean => {
  switch (node.type) {
    case AST_NODE_TYPES.ExpressionStatement:
      return shouldBeInHook(
        node.expression,
        allowedFunctionCalls,
        vitestFnCallParser,
      )
    case AST_NODE_TYPES.CallExpression:
      return !(
        isVitestFnCall(node, vitestFnCallParser) ||
        allowedFunctionCalls.includes(getNodeName(node) as string)
      )
    case AST_NODE_TYPES.VariableDeclaration: {
      if (node.kind === 'const') return false

      return node.declarations.some(
        ({ init }) => init !== null && !isNullOrUndefined(init),
      )
    }
    default:
      return false
  }
}

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'require setup and teardown to be within a hook',
      recommended: false,
    },
    messages: {
      useHook: 'This should be done within a hook',
    },
    type: 'suggestion',
    schema: [
      {
        type: 'object',
        properties: {
          allowedFunctionCalls: {
            description: 'Function calls that are allowed outside of hooks.',
            type: 'array',
            items: { type: 'string' },
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [
      {
        allowedFunctionCalls: [],
      },
    ],
  },
  create(context, options) {
    const vitestFnCallParser = new VitestFnCallParser(context)
    const checkBlockBody = (body: TSESTree.BlockStatement['body']) => {
      for (const statement of body) {
        if (
          shouldBeInHook(
            statement,
            options[0].allowedFunctionCalls,
            vitestFnCallParser,
          )
        ) {
          context.report({
            node: statement,
            messageId: 'useHook',
          })
        }
      }
    }

    return {
      Program(program) {
        checkBlockBody(program.body)
      },
      CallExpression(node) {
        if (
          !vitestFnCallParser.isTypeOfVitestFnCall(node, ['describe']) ||
          node.arguments.length < 2
        )
          return

        const [, testFn] = node.arguments

        if (
          !isFunction(testFn) ||
          testFn.body.type !== AST_NODE_TYPES.BlockStatement
        )
          return

        checkBlockBody(testFn.body.body)
      },
    }
  },
})
