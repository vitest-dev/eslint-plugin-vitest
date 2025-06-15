import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'
import { followTypeAssertionChain } from '../utils/ast-utils'

export const RULE_NAME = 'prefer-vi-mocked'
type MESSAGE_IDS = 'useViMocked'

const mockTypes = ['Mock', 'MockedFunction', 'MockedClass', 'MockedObject']

type Options = []

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require `vi.mocked()` over `fn as Mock`',
      requiresTypeChecking: true,
      recommended: false,
    },
    fixable: 'code',
    messages: {
      useViMocked: 'Prefer `vi.mocked()`',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    function check(node: TSESTree.TSAsExpression | TSESTree.TSTypeAssertion) {
      const { typeAnnotation } = node

      if (typeAnnotation.type !== AST_NODE_TYPES.TSTypeReference) return

      const { typeName } = typeAnnotation

      if (typeName.type !== AST_NODE_TYPES.Identifier) return

      if (!mockTypes.includes(typeName.name)) return

      const fnName = context.sourceCode.text.slice(
        ...followTypeAssertionChain(node.expression).range,
      )

      context.report({
        node,
        messageId: 'useViMocked',
        fix(fixer) {
          return fixer.replaceText(node, `vi.mocked(${fnName})`)
        },
      })
    }

    return {
      TSAsExpression(node) {
        if (node.parent.type === AST_NODE_TYPES.TSAsExpression) return

        check(node)
      },
      TSTypeAssertion(node) {
        check(node)
      },
    }
  },
})
