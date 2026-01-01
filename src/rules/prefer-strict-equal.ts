import {
  createEslintRule,
  isSupportedAccessor,
  replaceAccessorFixer,
} from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'
import { EqualityMatcher } from '../utils/types'

const RULE_NAME = 'prefer-strict-equal'
export type MESSAGE_IDS = 'useToStrictEqual' | 'suggestReplaceWithStrictEqual'
type Options = []

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce strict equal over equal',
      recommended: false,
    },
    messages: {
      useToStrictEqual: 'Use `toStrictEqual()` instead',
      suggestReplaceWithStrictEqual: 'Replace with `toStrictEqual()`',
    },
    schema: [],
    hasSuggestions: true,
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (vitestFnCall?.type !== 'expect') return

        const { matcher } = vitestFnCall

        if (isSupportedAccessor(matcher, 'toEqual')) {
          context.report({
            messageId: 'useToStrictEqual',
            node: matcher,
            suggest: [
              {
                messageId: 'suggestReplaceWithStrictEqual',
                fix: (fixer) => [
                  replaceAccessorFixer(
                    fixer,
                    matcher,
                    EqualityMatcher.toStrictEqual,
                  ),
                ],
              },
            ],
          })
        }
      },
    }
  },
})
