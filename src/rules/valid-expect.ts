import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, FunctionExpression, getAccessorValue, isFunction, isSupportedAccessor } from '../utils'
import { parseVitestFnCallWithReason } from '../utils/parse-vitest-fn-call'
import { ModifierName } from '../utils/types'
import { parsePluginSettings } from '../utils/parse-plugin-settings'

export const RULE_NAME = 'valid-expect'
export type MESSAGE_IDS =
  | 'tooManyArgs'
  | 'notEnoughArgs'
  | 'modifierUnknown'
  | 'matcherNotFound'
  | 'matcherNotCalled'
  | 'asyncMustBeAwaited'
  | 'promisesWithAsyncAssertionsMustBeAwaited'

const defaultAsyncMatchers = ['toReject', 'toResolve']

/**
 * Async assertions might be called in Promise
 * methods like `Promise.x(expect1)` or `Promise.x([expect1, expect2])`.
 * If that's the case, Promise node have to be awaited or returned.
 *
 * @Returns CallExpressionNode
 */
const getPromiseCallExpressionNode = (node: TSESTree.Node) => {
  if (
    node.type === AST_NODE_TYPES.ArrayExpression
    && node.parent
    && node.parent.type === AST_NODE_TYPES.CallExpression
  )
    node = node.parent

  if (
    node.type === AST_NODE_TYPES.CallExpression
    && node.callee.type === AST_NODE_TYPES.MemberExpression
    && isSupportedAccessor(node.callee.object, 'Promise')
    && node.parent
  )
    return node

  return null
}

const promiseArrayExceptionKey = ({ start, end }: TSESTree.SourceLocation) =>
  `${start.line}:${start.column}-${end.line}:${end.column}`

const getNormalizeFunctionExpression = (
  functionExpression: FunctionExpression
):
  | TSESTree.PropertyComputedName
  | TSESTree.PropertyNonComputedName
  | FunctionExpression => {
  if (
    functionExpression.parent.type === AST_NODE_TYPES.Property
    && functionExpression.type === AST_NODE_TYPES.FunctionExpression
  )
    return functionExpression.parent

  return functionExpression
}

function getParentIfThenified(node: TSESTree.Node): TSESTree.Node {
  const grandParentNode = node.parent?.parent

  if (grandParentNode
    && grandParentNode.type === AST_NODE_TYPES.CallExpression
    && grandParentNode.callee.type === AST_NODE_TYPES.MemberExpression
    && isSupportedAccessor(grandParentNode.callee.property)
    && ['then', 'catch'].includes(getAccessorValue(grandParentNode.callee.property)) && grandParentNode.parent)
    return getParentIfThenified(grandParentNode)

  return node
}

const findPromiseCallExpressionNode = (node: TSESTree.Node) =>
  node.parent?.parent
  && [AST_NODE_TYPES.CallExpression, AST_NODE_TYPES.ArrayExpression].includes(
    node.parent.type
  )
    ? getPromiseCallExpressionNode(node.parent)
    : null

const findFirstFunctionExpression = ({
  parent
}: TSESTree.Node): FunctionExpression | null => {
  if (!parent)
    return null

  return isFunction(parent) ? parent : findFirstFunctionExpression(parent)
}

const isAcceptableReturnNode = (
  node: TSESTree.Node,
  allowReturn: boolean
): node is
| TSESTree.ConditionalExpression
| TSESTree.ArrowFunctionExpression
| TSESTree.AwaitExpression
| TSESTree.ReturnStatement => {
  if (allowReturn && node.type === AST_NODE_TYPES.ReturnStatement)
    return true

  if (node.type === AST_NODE_TYPES.ConditionalExpression && node.parent)
    return isAcceptableReturnNode(node.parent, allowReturn)

  return [
    AST_NODE_TYPES.ArrowFunctionExpression,
    AST_NODE_TYPES.AwaitExpression
  ].includes(node.type)
}

export default createEslintRule<[
  Partial<{
    alwaysAwait: boolean
    asyncMatchers: string[]
    minArgs: number
    maxArgs: number
  }>
], MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'enforce valid `expect()` usage',
      recommended: false
    },
    messages: {
      tooManyArgs: 'Expect takes most {{ amount}} argument{{s}}',
      notEnoughArgs: 'Expect requires atleast {{ amount }} argument{{s}}',
      modifierUnknown: 'Expect has unknown modifier',
      matcherNotFound: 'Expect must have a corresponding matcher call.',
      matcherNotCalled: 'Matchers must be called to assert.',
      asyncMustBeAwaited: 'Async assertions must be awaited{{orReturned}}',
      promisesWithAsyncAssertionsMustBeAwaited:
        'Promises which return async assertions must be awaited{{orReturned}}'
    },
    type: 'suggestion',
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          alwaysAwait: {
            type: 'boolean',
            default: false
          },
          asyncMatchers: {
            type: 'array',
            items: { type: 'string' }
          },
          minArgs: {
            type: 'number',
            minimum: 1
          },
          maxArgs: {
            type: 'number',
            minimum: 1
          }
        },
        additionalProperties: false
      }
    ]
  },
  defaultOptions: [{
    alwaysAwait: false,
    asyncMatchers: defaultAsyncMatchers,
    minArgs: 1,
    maxArgs: 1
  }],
  create: (context, [{ alwaysAwait, asyncMatchers = defaultAsyncMatchers, minArgs = 1, maxArgs = 1 }]) => {
    const arrayExceptions = new Set<string>()
    const descriptors: Array<{
      node: TSESTree.Node
      messageId: Extract<
        MESSAGE_IDS,
        'asyncMustBeAwaited' | 'promisesWithAsyncAssertionsMustBeAwaited'
      >
    }> = []

    const pushPromiseArrayException = (loc: TSESTree.SourceLocation) => arrayExceptions.add(promiseArrayExceptionKey(loc))

    /**
        * Promise method that accepts an array of promises,
        * (eg. Promise.all), will throw warnings for the each
        * unawaited or non-returned promise. To avoid throwing
        * multiple warnings, we check if there is a warning in
        * the given location.
        */
    const promiseArrayExceptionExists = (loc: TSESTree.SourceLocation) =>
      arrayExceptions.has(promiseArrayExceptionKey(loc))

    const findTopMostMemberExpression = (node: TSESTree.MemberExpression): TSESTree.MemberExpression => {
      let topMostMemberExpression = node
      let { parent } = node

      while (parent) {
        if (parent.type !== AST_NODE_TYPES.MemberExpression)
          break

        topMostMemberExpression = parent
        parent = parent.parent
      }
      return topMostMemberExpression
    }

    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCallWithReason(node, context)
        const settings = parsePluginSettings(context.settings)

        if (typeof vitestFnCall === 'string') {
          const reportingNode
            = node.parent?.type === AST_NODE_TYPES.MemberExpression
              ? findTopMostMemberExpression(node.parent).property
              : node

          if (vitestFnCall === 'matcher-not-found') {
            context.report({
              messageId: 'matcherNotFound',
              node: reportingNode
            })

            return
          }

          if (vitestFnCall === 'matcher-not-called') {
            context.report({
              messageId: isSupportedAccessor(reportingNode)

                && ModifierName.hasOwnProperty(getAccessorValue(reportingNode))
                ? 'matcherNotFound'
                : 'matcherNotCalled',
              node: reportingNode
            })
          }

          if (vitestFnCall === 'modifier-unknown') {
            context.report({
              messageId: 'modifierUnknown',
              node: reportingNode
            })
            return
          }
          return
        }
        else if (vitestFnCall?.type === 'expectTypeOf' && settings.typecheck) {
          return
        }
        else if (vitestFnCall?.type !== 'expect') {
          return
        }

        const { parent: expect } = vitestFnCall.head.node

        if (expect?.type !== AST_NODE_TYPES.CallExpression)
          return

        if (expect.arguments.length < minArgs) {
          const expectLength = getAccessorValue(vitestFnCall.head.node).length

          const loc: TSESTree.SourceLocation = {
            start: {
              column: expect.loc.start.column + expectLength,
              line: expect.loc.start.line
            },
            end: {
              column: expect.loc.start.column + expectLength + 1,
              line: expect.loc.start.line
            }
          }

          context.report({
            messageId: 'notEnoughArgs',
            data: { amount: minArgs, s: minArgs === 1 ? '' : 's' },
            node: expect,
            loc
          })
        }

        if (expect.arguments.length > maxArgs) {
          // if expect(value, "message") and expect(value, `${message}`), it is valid usage
          // Note: 2nd argument should be string, not a variable in current implementation
          if (expect.arguments.length === 2) {
            //  expect(value, "string literal")
            const isSecondArgString = expect.arguments[1].type === AST_NODE_TYPES.Literal
              && typeof expect.arguments[1].value === 'string'
            // expect(value, `template literal`)
            const isSecondArgTemplateLiteral = expect.arguments[1].type === AST_NODE_TYPES.TemplateLiteral
            if (isSecondArgString || isSecondArgTemplateLiteral) {
              return
            }
          }

          const { start } = expect.arguments[maxArgs].loc
          const { end } = expect.arguments[expect.arguments.length - 1].loc

          const loc = {
            start,
            end: {
              column: end.column + 1,
              line: end.line
            }
          }

          context.report({
            messageId: 'tooManyArgs',
            data: { amount: maxArgs, s: maxArgs === 1 ? '' : 's' },
            node: expect,
            loc
          })
        }

        const { matcher } = vitestFnCall

        const parentNode = matcher.parent.parent
        const shouldBeAwaited
          = vitestFnCall.modifiers.some(nod => getAccessorValue(nod) !== 'not')
          || asyncMatchers.includes(getAccessorValue(matcher))

        if (!parentNode?.parent || !shouldBeAwaited)
          return

        const isParentArrayExpression
          = parentNode.parent.type === AST_NODE_TYPES.ArrayExpression

        const targetNode = getParentIfThenified(parentNode)
        const finalNode = findPromiseCallExpressionNode(targetNode) || targetNode

        if (finalNode.parent
          && !isAcceptableReturnNode(finalNode.parent, !alwaysAwait)
          && !promiseArrayExceptionExists(finalNode.loc)) {
          descriptors.push({
            messageId: finalNode === targetNode
              ? 'asyncMustBeAwaited'
              : 'promisesWithAsyncAssertionsMustBeAwaited',
            node: finalNode
          })

          if (isParentArrayExpression)
            pushPromiseArrayException(finalNode.loc)
        }
      },
      'Program:exit'() {
        const fixes: TSESLint.RuleFix[] = []

        descriptors.forEach(({ node, messageId }, index) => {
          const orReturned = alwaysAwait ? '' : ' or returned'

          context.report({
            loc: node.loc,
            data: { orReturned },
            messageId,
            node,
            fix(fixer) {
              const functionExpression = findFirstFunctionExpression(node)

              if (!functionExpression)
                return null

              const foundAsyncFixer = fixes.some(fix => fix.text === 'async ')

              if (!functionExpression.async && !foundAsyncFixer) {
                const targetFunction
                  = getNormalizeFunctionExpression(functionExpression)

                fixes.push(fixer.insertTextBefore(targetFunction, 'async '))
              }

              const returnStatement
                = node.parent?.type === AST_NODE_TYPES.ReturnStatement
                  ? node.parent
                  : null

              if (alwaysAwait && returnStatement) {
                const sourceCodeText
                = context.sourceCode.getText(returnStatement)
                const replacedText = sourceCodeText.replace('return', 'await')

                fixes.push(fixer.replaceText(returnStatement, replacedText))
              }
              else {
                fixes.push(fixer.insertTextBefore(node, 'await '))
              }

              return index === descriptors.length - 1 ? fixes : null
            }
          })
        })
      }
    }
  }
})
