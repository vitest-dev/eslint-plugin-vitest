import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'

const RULE_NAME = 'prefer-import-in-mock'

const MOCK_METHODS = new Set(['mock', 'doMock'])
const VITEST_OBJECTS = new Set(['vi', 'vitest'])

type MESSAGE_ID = 'preferImport'
type Options = [
  Partial<{
    fixable: boolean
  }>,
]

export default createEslintRule<Options, MESSAGE_ID>({
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
    schema: [
      {
        type: 'object',
        properties: {
          fixable: {
            description: 'Whether the rule should provide an autofix.',
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [{ fixable: true }],
  },
  create(context, options) {
    const fixable = options[0].fixable!

    return {
      CallExpression(node) {
        // Only consider vi.mock() calls
        if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return

        const vitestCallFn = parseVitestFnCall(node, context)

        if (vitestCallFn?.type !== 'vi') {
          return false
        }

        const { object, property } = node.callee

        // Vitest only rewrites `import()` paths for calls on `vi` or `vitest`,
        // so an aliased call such as `renamedVi.mock(import('./foo'))` fails at runtime
        if (
          object.type !== AST_NODE_TYPES.Identifier ||
          !VITEST_OBJECTS.has(object.name)
        ) {
          return
        }

        if (
          property.type != AST_NODE_TYPES.Identifier ||
          !MOCK_METHODS.has(property.name)
        ) {
          return
        }

        const pathArg = node.arguments[0]
        if (
          pathArg &&
          pathArg.type === AST_NODE_TYPES.Literal &&
          typeof pathArg.value === 'string'
        ) {
          context.report({
            messageId: 'preferImport',
            data: {
              path: pathArg.value,
            },
            node: node,
            fix(fixer) {
              if (!fixable) return null

              // keep the literal as written so quotes and escapes stay valid
              return fixer.replaceText(
                pathArg,
                `import(${context.sourceCode.getText(pathArg)})`,
              )
            },
          })
        }
      },
    }
  },
})
