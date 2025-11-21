import { createEslintRule } from '../utils'
import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'

export const RULE_NAME = 'require-import-vi-mock'

export default createEslintRule({
  name: RULE_NAME,
  meta: {
    fixable: 'code',
    type: 'suggestion',
    docs: {
      description: 'require usage of import in vi.mock()',
      requiresTypeChecking: false,
      recommended: false,
    },
    messages: {
      requireImport: "Replace '{{path}}' with import('{{path}}')",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        // Only consider vi.mock() calls
        if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return

        const vitestCallFn = parseVitestFnCall(node, context)

        if (vitestCallFn?.type !== 'vi') {
          return false
        }

        const { property } = node.callee
        if (
          property.type !== AST_NODE_TYPES.Identifier ||
          property.name !== 'mock'
        ) {
          return
        }

        const pathArg = node.arguments[0]
        if (pathArg && pathArg.type === AST_NODE_TYPES.Literal) {
          context.report({
            messageId: 'requireImport',
            data: {
              path: pathArg.value,
            },
            node: pathArg,
            fix(fixer) {
              return fixer.replaceText(pathArg, `import('${pathArg.value}')`)
            },
          })
        }
      },
    }
  },
})
