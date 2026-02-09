import { createEslintRule, getAccessorValue } from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'

type MESSAGE_IDS = 'preferToBeTrue' | 'preferToBeFalse'
const RULE_NAME = 'prefer-strict-boolean-matchers'
type Options = []

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce using `toBe(true)` and `toBe(false)` over matchers that coerce types to boolean',
      recommended: false,
    },
    messages: {
      preferToBeTrue: 'Prefer using `toBe(true)` to test value is `true`',
      preferToBeFalse: 'Prefer using `toBe(false)` to test value is `false`',
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)
        if (
          !(
            vitestFnCall?.type === 'expect' ||
            vitestFnCall?.type === 'expectTypeOf'
          )
        )
          return

        const accessor = getAccessorValue(vitestFnCall.matcher)
        if (accessor === 'toBeFalsy') {
          context.report({
            node: vitestFnCall.matcher,
            messageId: 'preferToBeFalse',
            fix: (fixer) => [
              fixer.replaceText(vitestFnCall.matcher, 'toBe'),
              fixer.insertTextAfterRange(
                [
                  vitestFnCall.matcher.range[0],
                  vitestFnCall.matcher.range[1] + 1,
                ],
                'false',
              ),
            ],
          })
        }
        if (accessor === 'toBeTruthy') {
          context.report({
            node: vitestFnCall.matcher,
            messageId: 'preferToBeTrue',
            fix: (fixer) => [
              fixer.replaceText(vitestFnCall.matcher, 'toBe'),
              fixer.insertTextAfterRange(
                [
                  vitestFnCall.matcher.range[0],
                  vitestFnCall.matcher.range[1] + 1,
                ],
                'true',
              ),
            ],
          })
        }
      },
    }
  },
})
