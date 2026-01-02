import { createEslintRule, getAccessorValue } from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'
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
  defaultOptions: [],
  create(context) {
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
                    ((key.type === AST_NODE_TYPES.Identifier &&
                      key.name === 'testTimeout') ||
                      (key.type === AST_NODE_TYPES.Literal &&
                        key.value === 'testTimeout')) &&
                    prop.value.type === AST_NODE_TYPES.Literal &&
                    typeof prop.value.value === 'number' &&
                    prop.value.value >= 0
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
                if (
                  prop.value.type === AST_NODE_TYPES.Literal &&
                  typeof prop.value.value === 'number' &&
                  prop.value.value >= 0
                ) {
                  foundObjectTimeout = true
                } else {
                  // any explicitly provided non-numeric or negative timeout is invalid
                  context.report({ node, messageId: 'missingTimeout' })

                  return
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
