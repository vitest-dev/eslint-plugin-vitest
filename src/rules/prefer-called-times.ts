import { createEslintRule, getAccessorValue } from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'

const RULE_NAME = 'prefer-called-times'
type MESSAGE_IDS = 'preferCalledTimes'
type Options = []

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        'enforce using `toBeCalledTimes(1)` or `toHaveBeenCalledTimes(1)`',
      recommended: false,
    },
    messages: {
      preferCalledTimes: 'Prefer {{ replacedMatcherName }}(1)',
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

        const { matcher } = vitestFnCall
        const matcherName = getAccessorValue(matcher)

        if (['toBeCalledOnce', 'toHaveBeenCalledOnce'].includes(matcherName)) {
          const replacedMatcherName = matcherName.replace('Once', 'Times')

          context.report({
            data: { replacedMatcherName },
            messageId: 'preferCalledTimes',
            node: matcher,
            fix: (fixer) => [
              fixer.replaceText(matcher, replacedMatcherName),
              fixer.insertTextAfterRange(
                [
                  vitestFnCall.matcher.range[0],
                  vitestFnCall.matcher.range[1] + 1,
                ],
                '1',
              ),
            ],
          })
        }
      },
    }
  },
})
