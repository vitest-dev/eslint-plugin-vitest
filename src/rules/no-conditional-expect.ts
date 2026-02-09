import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import {
  createEslintRule,
  isSupportedAccessor,
  KnownCallExpression,
} from '../utils'
import {
  getTestCallExpressionsFromDeclaredVariables,
  isTypeOfVitestFnCall,
  parseVitestFnCall,
} from '../utils/parse-vitest-fn-call'

const RULE_NAME = 'no-conditional-expect'
export type MESSAGE_ID = 'noConditionalExpect'
export type Options = [{ expectAssertions: boolean }]

const isCatchCall = (
  node: TSESTree.CallExpression,
): node is KnownCallExpression<'catch'> =>
  node.callee.type === AST_NODE_TYPES.MemberExpression &&
  isSupportedAccessor(node.callee.property, 'catch')

export default createEslintRule<Options, MESSAGE_ID>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow conditional expects',
      requiresTypeChecking: false,
      recommended: false,
    },
    messages: {
      noConditionalExpect:
        'Avoid calling `expect` inside conditional statements',
    },
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          expectAssertions: {
            description:
              'Enable/disable whether expect.assertions() is taken into account',
            type: 'boolean',
          },
        },
      },
    ],
    defaultOptions: [
      {
        expectAssertions: false,
      },
    ],
  },
  create(context, [options]) {
    let conditionalDepth = 0
    let inTestCase = false
    let inPromiseCatch = false
    let expectAssertions = 0

    const increaseConditionalDepth = () => inTestCase && conditionalDepth++
    const decreaseConditionalDepth = () => inTestCase && conditionalDepth--

    return {
      FunctionDeclaration(node) {
        const declaredVariables = context.sourceCode.getDeclaredVariables(node)
        const testCallExpressions = getTestCallExpressionsFromDeclaredVariables(
          declaredVariables,
          context,
        )

        if (testCallExpressions.length > 0) inTestCase = true
      },
      CallExpression(node: TSESTree.CallExpression) {
        const { type: vitestFnCallType } =
          parseVitestFnCall(node, context) ?? {}

        if (vitestFnCallType === 'test') inTestCase = true

        if (isCatchCall(node)) inPromiseCatch = true

        if (options.expectAssertions && inTestCase) {
          if (node.callee.type === 'MemberExpression') {
            if (
              node.callee.object.type === 'Identifier' &&
              node.callee.object.name === 'expect'
            ) {
              if (
                node.callee.property.type === 'Identifier' &&
                node.callee.property.name === 'assertions'
              ) {
                if (node.arguments.length === 1) {
                  const assertions = node.arguments[0]
                  if (assertions.type === 'Literal') {
                    expectAssertions = Number(assertions.value)
                  }
                }
              }
            }
          }
        }

        if (
          inTestCase &&
          vitestFnCallType === 'expect' &&
          conditionalDepth > 0 &&
          expectAssertions === 0
        ) {
          context.report({
            messageId: 'noConditionalExpect',
            node,
          })
        }

        if (inPromiseCatch && vitestFnCallType === 'expect') {
          context.report({
            messageId: 'noConditionalExpect',
            node,
          })
        }
      },
      'CallExpression:exit'(node) {
        if (isTypeOfVitestFnCall(node, context, ['test'])) {
          inTestCase = false
          expectAssertions = 0
        }

        if (isCatchCall(node)) inPromiseCatch = false
      },
      CatchClause: increaseConditionalDepth,
      'CatchClause:exit': decreaseConditionalDepth,
      IfStatement: increaseConditionalDepth,
      'IfStatement:exit': decreaseConditionalDepth,
      SwitchStatement: increaseConditionalDepth,
      'SwitchStatement:exit': decreaseConditionalDepth,
      ConditionalExpression: increaseConditionalDepth,
      'ConditionalExpression:exit': decreaseConditionalDepth,
      LogicalExpression: increaseConditionalDepth,
      'LogicalExpression:exit': decreaseConditionalDepth,
    }
  },
})
