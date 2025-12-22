import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'

export const RULE_NAME = 'prefer-import-in-mock'

type MESSAGE_ID = 'preferImport'

export default createEslintRule<[], MESSAGE_ID>({
  name: RULE_NAME,
  meta: {
    fixable: 'code',
    type: 'suggestion',
    docs: {
      description: 'prefer dynamic import in mock',
    },
    messages: {
      preferImport: "Replace '{{path}}' with import('{{path}}')",
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
          property.type != AST_NODE_TYPES.Identifier ||
          property.name != 'mock'
        ) {
          return
        }

        const pathArg = node.arguments[0]
        if (pathArg && pathArg.type === AST_NODE_TYPES.Literal) {
          context.report({
            messageId: 'preferImport',
            data: {
              path: pathArg.value,
            },
            node: node,
            fix(fixer) {
              return fixer.replaceText(pathArg, `import('${pathArg.value}')`)
            },
          })
        }
      },
    }
  },
})
