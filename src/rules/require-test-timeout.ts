import { Scope } from '@typescript-eslint/scope-manager'
import { createEslintRule, getAccessorValue } from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'
import { getScope } from '../utils/scope'
import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
export const RULE_NAME = 'require-test-timeout'
export type MESSAGE_ID = 'missingTimeout'
export type Options = []
export default createEslintRule<Options, MESSAGE_ID>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require tests to declare a timeout',
      recommended: false,
    },
    messages: {
      missingTimeout: 'Test is missing a timeout. Add an explicit timeout.',
    },
    schema: [],
  },
  create(context) {
    function resolveConstTimeout(
      node: TSESTree.Node | undefined,
      propName = 'timeout',
    ): number | undefined {
      if (!node) return undefined

      if (
        node.type === AST_NODE_TYPES.Literal &&
        typeof node.value === 'number'
      )
        return node.value

      // handle unary negative/positive numbers like -1
      if (
        node.type === AST_NODE_TYPES.UnaryExpression &&
        (node.operator === '-' || node.operator === '+') &&
        node.argument.type === AST_NODE_TYPES.Literal &&
        typeof node.argument.value === 'number'
      ) {
        return node.operator === '-'
          ? -node.argument.value
          : node.argument.value
      }

      if (node.type === AST_NODE_TYPES.ObjectExpression) {
        for (const prop of node.properties) {
          if (prop.type !== AST_NODE_TYPES.Property) continue

          const key = prop.key
          if (
            (key.type === AST_NODE_TYPES.Identifier && key.name === propName) ||
            (key.type === AST_NODE_TYPES.Literal && key.value === propName)
          ) {
            if (
              prop.value.type === AST_NODE_TYPES.Literal &&
              typeof prop.value.value === 'number'
            ) {
              return prop.value.value
            }

            // if the value is an identifier, try to resolve that identifier to a const
            if (prop.value.type === AST_NODE_TYPES.Identifier) {
              const nested = resolveConstTimeout(prop.value, propName)
              if (nested !== undefined) return nested
            }

            // explicitly present but non-numeric -> signal invalid
            return Number.NaN
          }
        }

        return undefined
      }

      if (node.type === AST_NODE_TYPES.Identifier) {
        let currentScope: Scope | null = getScope(context, node)
        let variable

        // Walk parent scopes until we find a definition for this identifier
        while (currentScope !== null) {
          const ref = currentScope.set.get(node.name)
          if (ref && ref.defs && ref.defs.length > 0) {
            variable = ref
            break
          }
          currentScope = currentScope.upper
        }

        if (!variable || !variable.defs || variable.defs.length === 0)
          return undefined

        for (const def of variable.defs) {
          if (def.type !== 'Variable') continue

          // only accept `const` bindings
          const parent = def.parent
          if (!isVariableDeclaration(parent) || parent.kind !== 'const')
            continue

          const declaratorNode = def.node
          if (!isVariableDeclarator(declaratorNode) || !declaratorNode.init)
            continue

          const init = declaratorNode.init
          if (
            init.type === AST_NODE_TYPES.Literal &&
            typeof init.value === 'number'
          )
            return init.value

          if (init.type === AST_NODE_TYPES.ObjectExpression) {
            for (const p of init.properties) {
              if (p.type !== AST_NODE_TYPES.Property) continue

              const key = p.key
              if (
                (key.type === AST_NODE_TYPES.Identifier &&
                  key.name === propName) ||
                (key.type === AST_NODE_TYPES.Literal && key.value === propName)
              ) {
                if (
                  p.value.type === AST_NODE_TYPES.Literal &&
                  typeof p.value.value === 'number'
                )
                  return p.value.value

                if (p.value.type === AST_NODE_TYPES.Identifier) {
                  const nested = resolveConstTimeout(p.value, propName)
                  if (nested !== undefined) return nested
                }

                return Number.NaN
              }
            }
          }
        }
      }

      return undefined
    }

    /**
     * Track positions (character offsets) of vi.setConfig({ testTimeout })
     * calls so we only exempt tests that appear _after_ the call. We use the
     * call's end offset and the test's start offset so that a setConfig on the
     * same line but before the test still exempts it.
     */
    const setConfigPositions: number[] = []

    return {
      CallExpression(node: TSESTree.CallExpression) {
        const vitestFnCall = parseVitestFnCall(node, context)

        // detect vi.setConfig({ testTimeout: ... })
        if (vitestFnCall && vitestFnCall.type === 'vi') {
          const firstMember = vitestFnCall.members[0]

          if (firstMember && getAccessorValue(firstMember) === 'setConfig') {
            const arg = node.arguments[0]

            if (arg && arg.type === AST_NODE_TYPES.ObjectExpression) {
              for (const prop of arg.properties) {
                if (prop.type === AST_NODE_TYPES.Property) {
                  const key = prop.key

                  // Only accept a numeric literal >= 0 for testTimeout
                  if (
                    (key.type === AST_NODE_TYPES.Identifier &&
                      key.name === 'testTimeout') ||
                    (key.type === AST_NODE_TYPES.Literal &&
                      key.value === 'testTimeout')
                  ) {
                    const resolved = resolveConstTimeout(
                      prop.value,
                      'testTimeout',
                    )

                    if (
                      resolved !== undefined &&
                      !Number.isNaN(resolved) &&
                      resolved >= 0
                    ) {
                      const endOffset = node.range ? node.range[1] : 0
                      setConfigPositions.push(endOffset)
                      break
                    }
                  }
                }
              }
            }
          }
        }

        if (!vitestFnCall) return
        if (vitestFnCall.type !== 'test' && vitestFnCall.type !== 'it') return
        if (
          // skip todo/skip/xit/etc.
          vitestFnCall.members.some((m) => {
            const v = getAccessorValue(m)
            return v === 'todo' || v === 'skip'
          }) ||
          vitestFnCall.name.startsWith('x')
        )
          return

        // check if test has a function callback
        const args = node.arguments
        const hasFunctionArg = args.some(
          (a) =>
            a.type === AST_NODE_TYPES.FunctionExpression ||
            a.type === AST_NODE_TYPES.ArrowFunctionExpression,
        )

        if (!hasFunctionArg) return

        /**
         * If there is a setConfig call *before* this test that sets testTimeout,
         * exempt this test. Note: we compare source positions (character offsets)
         * so that a later setConfig call does not affect earlier tests.
         */
        const testPos = node.range ? node.range[0] : 0

        if (setConfigPositions.some((p) => p <= testPos)) return

        let foundNumericTimeout = false
        let foundObjectTimeout = false

        // numeric literal timeout as argument (third-arg style)
        for (const a of args) {
          if (
            a.type === AST_NODE_TYPES.Literal &&
            typeof a.value === 'number'
          ) {
            if (a.value >= 0) {
              foundNumericTimeout = true
            } else {
              // negative numeric timeouts are explicitly invalid
              context.report({ node, messageId: 'missingTimeout' })
              return
            }
          }

          // identifier that resolves to a const numeric or const object with `timeout`
          if (a.type === AST_NODE_TYPES.Identifier) {
            const resolved = resolveConstTimeout(a, 'timeout')
            if (resolved !== undefined) {
              if (Number.isNaN(resolved)) {
                context.report({ node, messageId: 'missingTimeout' })
                return
              }

              if (resolved >= 0) {
                foundNumericTimeout = true
              } else {
                context.report({ node, messageId: 'missingTimeout' })
                return
              }
            }
          }

          // object literal with timeout property
          if (a.type === AST_NODE_TYPES.ObjectExpression) {
            for (const prop of a.properties) {
              if (prop.type !== AST_NODE_TYPES.Property) continue

              const key = prop.key

              if (
                (key.type === AST_NODE_TYPES.Identifier &&
                  key.name === 'timeout') ||
                (key.type === AST_NODE_TYPES.Literal && key.value === 'timeout')
              ) {
                const resolved = resolveConstTimeout(prop.value, 'timeout')

                if (resolved !== undefined) {
                  if (Number.isNaN(resolved)) {
                    context.report({ node, messageId: 'missingTimeout' })
                    return
                  }

                  if (resolved >= 0) {
                    foundObjectTimeout = true
                  } else {
                    context.report({ node, messageId: 'missingTimeout' })
                    return
                  }
                }
              }
            }
          }
        }

        if (foundNumericTimeout || foundObjectTimeout) return

        context.report({ node, messageId: 'missingTimeout' })
      },
    }
  },
})

function isVariableDeclaration(
  node: TSESTree.Node | null | undefined,
): node is TSESTree.VariableDeclaration {
  return !!node && node.type === AST_NODE_TYPES.VariableDeclaration
}

function isVariableDeclarator(
  node: TSESTree.Node | null | undefined,
): node is TSESTree.VariableDeclarator {
  return !!node && node.type === AST_NODE_TYPES.VariableDeclarator
}
