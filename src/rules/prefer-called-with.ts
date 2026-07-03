import {
  createEslintRule,
  getAccessorValue,
  replaceAccessorFixer,
} from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'

const RULE_NAME = 'prefer-called-with'
type MESSAGE_IDS = 'preferCalledWith'
type Options = []

const PREFERRED_MATCHERS = {
  toBeCalled: 'toBeCalledWith',
  toHaveBeenCalled: 'toHaveBeenCalledWith',
  toHaveBeenCalledOnce: 'toHaveBeenCalledExactlyOnceWith',
} as const

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        'enforce using `toBeCalledWith()` or `toHaveBeenCalledWith()`',
      recommended: false,
    },
    messages: {
      preferCalledWith: 'Prefer {{ matcherName }}(/* expected args */)',
    },
    type: 'suggestion',
    fixable: 'code',
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (vitestFnCall?.type !== 'expect') return

        if (
          vitestFnCall.modifiers.some(
            (node) => getAccessorValue(node) === 'not',
          )
        )
          return

        const { matcher } = vitestFnCall
        const matcherName = getAccessorValue(matcher)

        if (!Object.hasOwn(PREFERRED_MATCHERS, matcherName)) return

        const preferredMatcher =
          PREFERRED_MATCHERS[matcherName as keyof typeof PREFERRED_MATCHERS]

        context.report({
          data: { matcherName: preferredMatcher },
          messageId: 'preferCalledWith',
          node: matcher,
          fix: (fixer) => [
            replaceAccessorFixer(fixer, matcher, preferredMatcher),
          ],
        })
      },
    }
  },
})
