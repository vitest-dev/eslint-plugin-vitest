import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import {
  KnownCallExpression,
  createEslintRule,
  getAccessorValue,
  isSupportedAccessor,
} from '../utils'
import { hasOnlyOneArgument, isBooleanLiteral } from '../utils/msc'
import {
  getFirstMatcherArg,
  parseVitestFnCall,
} from '../utils/parse-vitest-fn-call'
import {
  CallExpressionWithSingleArgument,
  EqualityMatcher,
  ModifierName,
} from '../utils/types'

export const RULE_NAME = 'prefer-to-contain'
type MESSAGE_IDS = 'useToContain'
type Options = []

type FixableIncludesCallExpression = KnownCallExpression<'includes'> &
  CallExpressionWithSingleArgument

const isFixableIncludesCallExpression = (
  node: TSESTree.Node,
): node is FixableIncludesCallExpression =>
  node.type === AST_NODE_TYPES.CallExpression &&
  node.callee.type === AST_NODE_TYPES.MemberExpression &&
  isSupportedAccessor(node.callee.property, 'includes') &&
  hasOnlyOneArgument(node) &&
  node.arguments[0].type !== AST_NODE_TYPES.SpreadElement

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'enforce using toContain()',
      recommended: false,
    },
    messages: {
      useToContain: 'Use toContain() instead',
    },
    fixable: 'code',
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (vitestFnCall?.type !== 'expect' || vitestFnCall.args.length === 0)
          return

        const { parent: expect } = vitestFnCall.head.node

        if (expect?.type !== AST_NODE_TYPES.CallExpression) return

        const {
          arguments: [includesCall],
          range: [, expectCallEnd],
        } = expect

        const { matcher } = vitestFnCall
        const matcherArg = getFirstMatcherArg(vitestFnCall)

        if (
          !includesCall ||
          matcherArg.type === AST_NODE_TYPES.SpreadElement ||
          !EqualityMatcher.hasOwnProperty(getAccessorValue(matcher)) ||
          !isBooleanLiteral(matcherArg) ||
          !isFixableIncludesCallExpression(includesCall)
        )
          return

        const hasNot = vitestFnCall.modifiers.some(
          (nod) => getAccessorValue(nod) === 'not',
        )

        context.report({
          fix(fixer) {
            const { sourceCode } = context

            const addNotModifier = matcherArg.value === hasNot

            return [
              fixer.removeRange([
                includesCall.callee.property.range[0] - 1,
                includesCall.range[1],
              ]),
              fixer.replaceTextRange(
                [expectCallEnd, matcher.parent.range[1]],
                addNotModifier
                  ? `.${ModifierName.not}.toContain`
                  : '.toContain',
              ),
              fixer.replaceText(
                vitestFnCall.args[0],
                sourceCode.getText(includesCall.arguments[0]),
              ),
            ]
          },
          messageId: 'useToContain',
          node: matcher,
        })
      },
    }
  },
})
