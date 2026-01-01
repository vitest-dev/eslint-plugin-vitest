import {
  AST_NODE_TYPES,
  type TSESLint,
  type TSESTree,
} from '@typescript-eslint/utils'
import {
  createEslintRule,
  getAccessorValue,
  isFunction,
  removeExtraArgumentsFixer,
} from '../utils'
import {
  ParsedExpectVitestFnCall,
  isTypeOfVitestFnCall,
  parseVitestFnCall,
} from '../utils/parse-vitest-fn-call'

type Options = {
  onlyFunctionsWithAsyncKeyword?: boolean
  onlyFunctionsWithExpectInLoop?: boolean
  onlyFunctionsWithExpectInCallback?: boolean
}

const RULE_NAME = 'prefer-expect-assertions'

type MessageIds =
  | 'hasAssertionsTakesNoArguments'
  | 'assertionsRequiresOneArgument'
  | 'assertionsRequiresNumberArgument'
  | 'haveExpectAssertions'
  | 'suggestAddingHasAssertions'
  | 'suggestAddingAssertions'
  | 'suggestRemovingExtraArguments'

const isFirstStatement = (node: TSESTree.CallExpression): boolean => {
  let parent: TSESTree.Node['parent'] = node

  while (parent) {
    if (parent.parent?.type === AST_NODE_TYPES.BlockStatement)
      return parent.parent.body[0] === parent

    if (parent.parent?.type === AST_NODE_TYPES.ArrowFunctionExpression)
      return true

    parent = parent.parent
  }

  throw new Error('Could not find parent block statement')
}

const suggestRemovingExtraArguments = (
  context: TSESLint.RuleContext<string, unknown[]>,
  func: TSESTree.CallExpression,
  from: number,
): TSESLint.ReportSuggestionArray<MessageIds>[0] => ({
  messageId: 'suggestRemovingExtraArguments',
  fix: (fixer) => removeExtraArgumentsFixer(fixer, context, func, from),
})

export default createEslintRule<Options[], MessageIds>({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'enforce using expect assertions instead of callbacks',
      recommended: false,
    },
    messages: {
      hasAssertionsTakesNoArguments:
        '`expect.hasAssertions` expects no arguments',
      assertionsRequiresOneArgument:
        '`expect.assertions` excepts a single argument of type number',
      assertionsRequiresNumberArgument: 'This argument should be a number',
      haveExpectAssertions:
        'Every test should have either `expect.assertions(<number of assertions>)` or `expect.hasAssertions()` as its first expression',
      suggestAddingHasAssertions: 'Add `expect.hasAssertions()`',
      suggestAddingAssertions:
        'Add `expect.assertions(<number of assertions>)`',
      suggestRemovingExtraArguments: 'Remove extra arguments',
    },
    type: 'suggestion',
    hasSuggestions: true,
    schema: [
      {
        type: 'object',
        properties: {
          onlyFunctionsWithAsyncKeyword: { type: 'boolean' },
          onlyFunctionsWithExpectInLoop: { type: 'boolean' },
          onlyFunctionsWithExpectInCallback: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [
    {
      onlyFunctionsWithAsyncKeyword: false,
      onlyFunctionsWithExpectInCallback: false,
      onlyFunctionsWithExpectInLoop: false,
    },
  ],
  create(context, [options]) {
    let expressionDepth = 0
    let hasExpectInCallBack = false
    let hasExpectInLoop = false
    let hasExpectAssertAsFirstStatement = false
    let testContextName: string | null = null
    let inTestCaseCall = false
    let inForLoop = false

    const shouldCheckFunction = (testFunction: TSESTree.FunctionLike) => {
      if (
        !options.onlyFunctionsWithAsyncKeyword &&
        !options.onlyFunctionsWithExpectInCallback &&
        !options.onlyFunctionsWithExpectInLoop
      )
        return true

      if (options.onlyFunctionsWithAsyncKeyword) {
        if (testFunction.async) return true
      }

      if (options.onlyFunctionsWithExpectInCallback) {
        if (hasExpectInCallBack) return true
      }

      if (options.onlyFunctionsWithExpectInLoop) {
        if (hasExpectInLoop) return true
      }

      return false
    }

    function checkExpectHasAssertions(
      expectFnCall: ParsedExpectVitestFnCall,
      func: TSESTree.CallExpression,
    ) {
      if (getAccessorValue(expectFnCall.members[0]) === 'hasAssertions') {
        if (expectFnCall.args.length) {
          context.report({
            messageId: 'hasAssertionsTakesNoArguments',
            node: expectFnCall.matcher,
            suggest: [suggestRemovingExtraArguments(context, func, 0)],
          })
        }
        return
      }

      if (expectFnCall.args.length !== 1) {
        let { loc } = expectFnCall.matcher
        const suggestions: TSESLint.ReportSuggestionArray<MessageIds> = []

        if (expectFnCall.args.length) {
          loc = expectFnCall.args[1].loc
          suggestions.push(suggestRemovingExtraArguments(context, func, 1))
        }

        context.report({
          messageId: 'assertionsRequiresOneArgument',
          suggest: suggestions,
          loc,
        })
        return
      }

      const [arg] = expectFnCall.args

      if (
        arg.type === AST_NODE_TYPES.Literal &&
        typeof arg.value === 'number' &&
        Number.isInteger(arg.value)
      )
        return

      context.report({
        messageId: 'assertionsRequiresNumberArgument',
        node: arg,
      })
    }
    const enterExpression = () => inTestCaseCall && expressionDepth++
    const exitExpression = () => inTestCaseCall && expressionDepth--
    const enterForLoop = () => (inForLoop = true)
    const exitForLoop = () => (inForLoop = false)

    return {
      FunctionExpression: enterExpression,
      'FunctionExpression:exit': exitExpression,
      ArrowFunctionExpression: enterExpression,
      'ArrowFunctionExpression:exit': exitExpression,
      ForStatement: enterForLoop,
      'ForStatement:exit': exitForLoop,
      ForInStatement: enterForLoop,
      'ForInStatement:exit': exitForLoop,
      ForOfStatement: enterForLoop,
      'ForOfStatement:exit': exitForLoop,
      CallExpression(node: TSESTree.CallExpression) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (vitestFnCall?.type === 'test') {
          inTestCaseCall = true
          return
        }

        if (
          vitestFnCall?.head.type === 'testContext' &&
          vitestFnCall.members[0] &&
          vitestFnCall.members[0].type === AST_NODE_TYPES.Identifier &&
          vitestFnCall.members[0].name === 'expect'
        ) {
          testContextName = `${vitestFnCall.head.local}`
        }

        if (vitestFnCall?.type === 'expect' && inTestCaseCall) {
          if (
            expressionDepth === 1 &&
            isFirstStatement(node) &&
            vitestFnCall.head.node.parent?.type ===
              AST_NODE_TYPES.MemberExpression &&
            vitestFnCall.members.length === 1 &&
            ['assertions', 'hasAssertions'].includes(
              getAccessorValue(vitestFnCall.members[0]),
            )
          ) {
            checkExpectHasAssertions(vitestFnCall, node)
            hasExpectAssertAsFirstStatement = true
          }

          if (inForLoop) hasExpectInLoop = true

          if (expressionDepth > 1) hasExpectInCallBack = true
        }
      },

      'CallExpression:exit'(node: TSESTree.CallExpression) {
        if (!isTypeOfVitestFnCall(node, context, ['test'])) return

        inTestCaseCall = false

        if (node.arguments.length < 2) return

        const [, secondArg] = node.arguments

        if (!isFunction(secondArg) || !shouldCheckFunction(secondArg)) return

        hasExpectInLoop = false
        hasExpectInCallBack = false

        if (hasExpectAssertAsFirstStatement) {
          hasExpectAssertAsFirstStatement = false

          return
        }

        const suggestions: Array<[MessageIds, string]> = []

        if (secondArg.body.type === AST_NODE_TYPES.BlockStatement) {
          const prefix = testContextName ? `${testContextName}.` : ''
          suggestions.push(
            ['suggestAddingHasAssertions', `${prefix}expect.hasAssertions();`],
            ['suggestAddingAssertions', `${prefix}expect.assertions();`],
          )
        }

        context.report({
          messageId: 'haveExpectAssertions',
          node,
          suggest: suggestions.map(([messageId, text]) => ({
            messageId,
            fix: (fixer) =>
              fixer.insertTextBeforeRange(
                [secondArg.body.range[0] + 1, secondArg.body.range[1]],
                text,
              ),
          })),
        })
      },
    }
  },
})
