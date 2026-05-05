import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { createEslintRule, getAccessorValue } from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'

const RULE_NAME = 'prefer-expect-type-of'

type MessageId = 'preferExpectTypeOf'

export default createEslintRule<[], MessageId>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce using `expect(...).toBeTypeOf(...)` instead of `expect(typeof ...).toBe(...)`',
      recommended: false,
    },
    schema: [],
    fixable: 'code',
    messages: {
      preferExpectTypeOf:
        'Use `expect({{ value }}).toBeTypeOf({{ type }})` instead of `expect(typeof {{ value }}).toBe({{ type }})`',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (vitestFnCall?.type !== 'expect') return

        if (
          vitestFnCall.head.node.parent?.type !== AST_NODE_TYPES.CallExpression
        )
          return

        const expectCall = vitestFnCall.head.node.parent
        const [firstArg] = expectCall.arguments

        if (!firstArg || firstArg.type !== AST_NODE_TYPES.UnaryExpression)
          return
        if (firstArg.operator !== 'typeof') return

        const matcherName = getAccessorValue(vitestFnCall.matcher)
        if (matcherName !== 'toBe' && matcherName !== 'toEqual') return

        const [matcherArg] = vitestFnCall.args
        if (!matcherArg || matcherArg.type === AST_NODE_TYPES.SpreadElement)
          return

        const valueText = context.sourceCode.getText(firstArg.argument)
        const typeText = context.sourceCode.getText(matcherArg)
        const modifierText = vitestFnCall.modifiers
          .map((mod) => getAccessorValue(mod))
          .join('.')
        const modifierPrefix = modifierText ? `.${modifierText}` : ''

        context.report({
          node,
          messageId: 'preferExpectTypeOf',
          data: {
            value: valueText,
            type: typeText,
          },
          fix(fixer) {
            return fixer.replaceText(
              node,
              `expect(${valueText})${modifierPrefix}.toBeTypeOf(${typeText})`,
            )
          },
        })
      },
    }
  },
})
