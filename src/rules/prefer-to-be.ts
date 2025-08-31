import { TSESLint, AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import {
  AccessorNode,
  createEslintRule,
  getAccessorValue,
  isIdentifier,
  removeExtraArgumentsFixer,
  replaceAccessorFixer,
} from '../utils'
import {
  getFirstMatcherArg,
  ParsedExpectVitestFnCall,
  parseVitestFnCall,
} from '../utils/parse-vitest-fn-call'
import { EqualityMatcher } from '../utils/types'

export const RULE_NAME = 'prefer-to-be'

const isNullLiteral = (node: TSESTree.Node): node is TSESTree.NullLiteral =>
  node.type === AST_NODE_TYPES.Literal && node.value === null

const isNullEqualityMatcher = (expectFnCall: ParsedExpectVitestFnCall) =>
  isNullLiteral(getFirstMatcherArg(expectFnCall))

const isFirstArgumentIdentifier = (
  expectFnCall: ParsedExpectVitestFnCall,
  name: string,
) => isIdentifier(getFirstMatcherArg(expectFnCall), name)

const isFloat = (v: number) => Math.floor(v) !== Math.ceil(v)

const shouldUseToBe = (expectFnCall: ParsedExpectVitestFnCall): boolean => {
  let firstArg = getFirstMatcherArg(expectFnCall)

  if (
    firstArg.type === AST_NODE_TYPES.Literal &&
    typeof firstArg.value === 'number' &&
    isFloat(firstArg.value)
  )
    return false

  if (
    firstArg.type === AST_NODE_TYPES.UnaryExpression &&
    firstArg.operator === '-'
  )
    firstArg = firstArg.argument

  if (firstArg.type === AST_NODE_TYPES.Literal) {
    // regex literals are classed as literals, but they're actually objects
    // which means "toBe" will give different results than other matchers
    return !('regex' in firstArg)
  }

  return firstArg.type === AST_NODE_TYPES.TemplateLiteral
}

type MessageId =
  | 'useToBe'
  | 'useToBeUndefined'
  | 'useToBeDefined'
  | 'useToBeNull'
  | 'useToBeNaN'

type ToBeWhat = MessageId extends `useToBe${infer M}` ? M : never

const reportPreferToBe = (
  context: TSESLint.RuleContext<MessageId, unknown[]>,
  whatToBe: ToBeWhat,
  expectFnCall: ParsedExpectVitestFnCall,
  func: TSESTree.CallExpression,
  modifierNode?: AccessorNode,
) => {
  context.report({
    messageId: `useToBe${whatToBe}`,
    fix(fixer) {
      const fixes = [
        replaceAccessorFixer(fixer, expectFnCall.matcher, `toBe${whatToBe}`),
      ]

      if (expectFnCall.args?.length && whatToBe !== '')
        fixes.push(removeExtraArgumentsFixer(fixer, context, func, 0))

      if (modifierNode) {
        fixes.push(
          fixer.removeRange([modifierNode.range[0] - 1, modifierNode.range[1]]),
        )
      }

      return fixes
    },
    node: expectFnCall.matcher,
  })
}

export default createEslintRule<[], MessageId>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce using toBe()',
      recommended: false,
    },
    schema: [],
    fixable: 'code',
    messages: {
      useToBe: 'Use `toBe` instead',
      useToBeUndefined: 'Use `toBeUndefined()` instead',
      useToBeDefined: 'Use `toBeDefined()` instead',
      useToBeNull: 'Use `toBeNull()` instead',
      useToBeNaN: 'Use `toBeNaN()` instead',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (vitestFnCall?.type !== 'expect') return

        const matcherName = getAccessorValue(vitestFnCall.matcher)
        const notModifier = vitestFnCall.modifiers.find(
          (node) => getAccessorValue(node) === 'not',
        )

        if (
          notModifier &&
          ['toBeUndefined', 'toBeDefined'].includes(matcherName)
        ) {
          reportPreferToBe(
            context,
            matcherName === 'toBeDefined' ? 'Undefined' : 'Defined',
            vitestFnCall,
            node,
            notModifier,
          )
          return
        }

        if (
          !EqualityMatcher.hasOwnProperty(matcherName) ||
          vitestFnCall.args.length === 0
        )
          return

        if (isNullEqualityMatcher(vitestFnCall)) {
          reportPreferToBe(context, 'Null', vitestFnCall, node)
          return
        }

        if (isFirstArgumentIdentifier(vitestFnCall, 'undefined')) {
          const name = notModifier ? 'Defined' : 'Undefined'
          reportPreferToBe(context, name, vitestFnCall, node)
          return
        }

        if (isFirstArgumentIdentifier(vitestFnCall, 'NaN')) {
          reportPreferToBe(context, 'NaN', vitestFnCall, node)
          return
        }

        if (shouldUseToBe(vitestFnCall) && matcherName !== EqualityMatcher.toBe)
          reportPreferToBe(context, '', vitestFnCall, node)
      },
    }
  },
})
