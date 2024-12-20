import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { createEslintRule, getAccessorValue, isParsedInstanceOfMatcherCall } from '../utils'
import { isBooleanEqualityMatcher, isInstanceOfBinaryExpression } from '../utils/msc'
import { followTypeAssertionChain, parseVitestFnCall } from '../utils/parse-vitest-fn-call'

export const RULE_NAME = 'prefer-to-be-object'
export type MESSAGE_IDS = 'preferToBeObject'
export type Options = []

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce using toBeObject()',
      recommended: false
    },
    fixable: 'code',
    messages: {
      preferToBeObject: 'Prefer toBeObject() to test if a value is an object.'
    },
    schema: []
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (vitestFnCall?.type !== 'expectTypeOf')
          return

        if (isParsedInstanceOfMatcherCall(vitestFnCall, 'Object')) {
          context.report({
            node: vitestFnCall.matcher,
            messageId: 'preferToBeObject',
            fix: fixer => [
              fixer.replaceTextRange(
                [
                  vitestFnCall.matcher.range[0],
                  vitestFnCall.matcher.range[1] + '(Object)'.length
                ],
                'toBeObject()'
              )
            ]
          })
          return
        }

        const { parent: expectTypeOf } = vitestFnCall.head.node

        if (expectTypeOf?.type !== AST_NODE_TYPES.CallExpression)
          return

        const [expectTypeOfArgs] = expectTypeOf.arguments

        if (!expectTypeOfArgs
          || !isBooleanEqualityMatcher(vitestFnCall)
          || !isInstanceOfBinaryExpression(expectTypeOfArgs, 'Object'))
          return

        context.report({
          node: vitestFnCall.matcher,
          messageId: 'preferToBeObject',
          fix(fixer) {
            const fixes = [
              fixer.replaceText(vitestFnCall.matcher, 'toBeObject'),
              fixer.removeRange([expectTypeOfArgs.left.range[1], expectTypeOfArgs.range[1]])
            ]

            let invertCondition = getAccessorValue(vitestFnCall.matcher) === 'toBeFalsy'

            if (vitestFnCall.args.length) {
              const [matcherArg] = vitestFnCall.args

              fixes.push(fixer.remove(matcherArg))

              invertCondition = matcherArg.type === AST_NODE_TYPES.Literal
              && followTypeAssertionChain(matcherArg).value === false
            }

            if (invertCondition) {
              const notModifier = vitestFnCall.modifiers.find(node => getAccessorValue(node) === 'not')

              fixes.push(notModifier
                ? fixer.removeRange([
                    notModifier.range[0] - 1,
                    notModifier.range[1]
                  ])
                : fixer.insertTextBefore(vitestFnCall.matcher, 'not.')
              )
            }
            return fixes
          }
        })
      }
    }
  }
})
