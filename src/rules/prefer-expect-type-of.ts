import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { createEslintRule, getAccessorValue } from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'

export const RULE_NAME = 'prefer-expect-type-of'

type MessageId = 'preferExpectTypeOf'

const typeMatchers = {
  string: 'toBeString',
  number: 'toBeNumber',
  boolean: 'toBeBoolean',
  object: 'toBeObject',
  function: 'toBeFunction',
  symbol: 'toBeSymbol',
  bigint: 'toBeBigInt',
  undefined: 'toBeUndefined',
} as const

export default createEslintRule<[], MessageId>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce using `expectTypeOf` instead of `expect(typeof ...)`',
      recommended: false,
    },
    schema: [],
    fixable: 'code',
    messages: {
      preferExpectTypeOf:
        'Use `expectTypeOf({{ value }}).{{ matcher }}()` instead of `expect(typeof {{ value }}).toBe("{{ type }}")`',
    },
  },
  defaultOptions: [],
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
        if (!matcherArg || matcherArg.type !== AST_NODE_TYPES.Literal) return
        if (typeof matcherArg.value !== 'string') return

        const typeString = matcherArg.value as keyof typeof typeMatchers
        const expectTypeOfMatcher = typeMatchers[typeString]

        if (!expectTypeOfMatcher) return

        const valueText = context.sourceCode.getText(firstArg.argument)
        const modifierText = vitestFnCall.modifiers
          .map((mod) => getAccessorValue(mod))
          .join('.')
        const modifierPrefix = modifierText ? `.${modifierText}` : ''

        context.report({
          node,
          messageId: 'preferExpectTypeOf',
          data: {
            value: valueText,
            matcher: expectTypeOfMatcher,
            type: typeString,
          },
          fix(fixer) {
            return fixer.replaceText(
              node,
              `expectTypeOf(${valueText})${modifierPrefix}.${expectTypeOfMatcher}()`,
            )
          },
        })
      },
    }
  },
})
