import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils'
import {
  type FunctionExpression,
  createEslintRule,
  getAccessorValue,
  isFunction,
  isSupportedAccessor,
} from '../utils'

const RULE_NAME = 'no-mock-implementation-throw'
type MESSAGE_IDS = 'useMockThrow'
type Options = []

const withOnce = (name: string, addOnce: boolean): string => {
  return `${name}${addOnce ? 'Once' : ''}`
}

const findSingleThrowArgumentNode = (
  fnNode: FunctionExpression,
): TSESTree.Expression | null => {
  // `throw` is a statement, so it can only appear in a block body
  if (fnNode.body.type !== AST_NODE_TYPES.BlockStatement) return null

  const [firstStatement] = fnNode.body.body

  if (firstStatement?.type === AST_NODE_TYPES.ThrowStatement)
    return firstStatement.argument

  return null
}

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'disallow mock implementations that only throw',
      recommended: false,
    },
    messages: {
      useMockThrow: 'Prefer {{ replacement }}',
    },
    schema: [],
    type: 'suggestion',
    fixable: 'code',
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type !== AST_NODE_TYPES.MemberExpression ||
          !isSupportedAccessor(node.callee.property) ||
          node.arguments.length === 0
        ) {
          return
        }

        const { property } = node.callee

        const mockFnName = getAccessorValue(property)
        const isOnce = mockFnName.endsWith('Once')

        if (mockFnName !== withOnce('mockImplementation', isOnce)) {
          return
        }

        const [arg] = node.arguments

        // an `async` function returns a rejected promise rather than throwing,
        // and a generator doesn't throw until it is iterated
        if (
          !isFunction(arg) ||
          arg.params.length !== 0 ||
          arg.async ||
          arg.generator
        ) {
          return
        }

        const replacement = withOnce('mockThrow', isOnce)

        const throwNode = findSingleThrowArgumentNode(arg)

        if (!throwNode || throwNode.type === AST_NODE_TYPES.UpdateExpression) {
          return
        }

        // check if we're using a non-constant variable
        if (throwNode.type === AST_NODE_TYPES.Identifier) {
          const scope = context.sourceCode.getScope(throwNode)

          const isMutable = scope.through.some((v) =>
            v.resolved?.defs.some(
              (n) => n.type === 'Variable' && n.parent.kind !== 'const',
            ),
          )

          if (isMutable) {
            return
          }
        }

        context.report({
          node: property,
          messageId: 'useMockThrow',
          data: { replacement },
          fix(fixer) {
            return [
              fixer.replaceText(property, replacement),
              fixer.replaceText(arg, context.sourceCode.getText(throwNode)),
            ]
          },
        })
      },
    }
  },
})
