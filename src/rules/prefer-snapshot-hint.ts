import {
  createEslintRule,
  getAccessorValue,
  isStringNode,
  isSupportedAccessor,
} from '../utils'
import {
  isTypeOfVitestFnCall,
  ParsedExpectVitestFnCall,
  parseVitestFnCall,
} from '../utils/parse-vitest-fn-call'

const RULE_NAME = 'prefer-snapshot-hint'
type MESSAGE_IDS = 'missingHint'
type Options = [('always' | 'multi')?]

const snapshotMatchers = ['toMatchSnapshot', 'toThrowErrorMatchingSnapshot']
const snapshotMatcherNames = snapshotMatchers

const isSnapshotMatcherWithoutHint = (
  expectFnCall: ParsedExpectVitestFnCall,
) => {
  if (expectFnCall.args.length === 0) return true

  if (!isSupportedAccessor(expectFnCall.matcher, 'toMatchSnapshot'))
    return expectFnCall.args.length !== 1

  if (expectFnCall.args.length === 2) return false

  const [arg] = expectFnCall.args

  return !isStringNode(arg)
}

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce including a hint with external snapshots',
      recommended: false,
    },
    messages: {
      missingHint: 'You should provide a hint for this snapshot',
    },
    schema: [
      {
        type: 'string',
        enum: ['always', 'multi'],
      },
    ],
    defaultOptions: [],
  },
  defaultOptions: ['multi'],
  create(context, [mode]) {
    const snapshotMatchers: ParsedExpectVitestFnCall[] = []
    let expressionDepth = 0
    const depths: number[] = []

    const reportSnapshotMatchersWithoutHints = () => {
      for (const snapshotMatcher of snapshotMatchers) {
        if (isSnapshotMatcherWithoutHint(snapshotMatcher)) {
          context.report({
            messageId: 'missingHint',
            node: snapshotMatcher.matcher,
          })
        }
      }
    }

    const enterExpression = () => {
      expressionDepth++
    }

    const exitExpression = () => {
      expressionDepth--

      if (mode === 'always') {
        reportSnapshotMatchersWithoutHints()
        snapshotMatchers.length = 0
      }

      if (mode === 'multi' && expressionDepth === 0) {
        if (snapshotMatchers.length > 1) reportSnapshotMatchersWithoutHints()

        snapshotMatchers.length = 0
      }
    }

    return {
      'Program:exit'() {
        enterExpression()
        exitExpression()
      },
      FunctionExpression: enterExpression,
      'FunctionExpression:exit': exitExpression,
      ArrowFunctionExpression: enterExpression,
      'ArrowFunctionExpression:exit': exitExpression,
      'CallExpression:exit'(node) {
        if (isTypeOfVitestFnCall(node, context, ['describe', 'test']))
          expressionDepth = depths.pop() ?? 0
      },
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (vitestFnCall?.type !== 'expect') {
          if (
            vitestFnCall?.type === 'describe' ||
            vitestFnCall?.type === 'test'
          ) {
            depths.push(expressionDepth)
            expressionDepth = 0
          }
          return
        }

        const matcherName = getAccessorValue(vitestFnCall.matcher)

        if (!snapshotMatcherNames.includes(matcherName)) return

        snapshotMatchers.push(vitestFnCall)
      },
    }
  },
})
