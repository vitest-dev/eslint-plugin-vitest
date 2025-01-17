import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getNodeName } from '../utils'

export const RULE_NAME = 'prefer-spy-on'
type MESSAGE_IDS = 'useViSpayOn'
type Options = []

const findNodeObject = (
  node: TSESTree.CallExpression | TSESTree.MemberExpression
): TSESTree.Expression | null => {
  if ('object' in node)
    return node.object

  if (node.callee.type === AST_NODE_TYPES.MemberExpression)
    return node.callee.object

  return null
}

const getVitestFnCall = (node: TSESTree.Node): TSESTree.CallExpression | null => {
  if (
    node.type !== AST_NODE_TYPES.CallExpression
    && node.type !== AST_NODE_TYPES.MemberExpression
  )
    return null

  const obj = findNodeObject(node)

  if (!obj)
    return null

  if (obj.type === AST_NODE_TYPES.Identifier) {
    return node.type === AST_NODE_TYPES.CallExpression
      && getNodeName(node.callee) === 'vi.fn'
      ? node
      : null
  }

  return getVitestFnCall(obj)
}

const getAutoFixMockImplementation = (
  vitestFnCall: TSESTree.CallExpression,
  context: TSESLint.RuleContext<MESSAGE_IDS, unknown[]>
): string => {
  const hasMockImplementationAlready
        = vitestFnCall.parent?.type === AST_NODE_TYPES.MemberExpression
          && vitestFnCall.parent.property.type === AST_NODE_TYPES.Identifier
          && vitestFnCall.parent.property.name === 'mockImplementation'

  if (hasMockImplementationAlready)
    return ''

  const [arg] = vitestFnCall.arguments
  const argSource = arg && context.sourceCode.getText(arg)

  return argSource
    ? `.mockImplementation(${argSource})`
    : '.mockImplementation()'
}

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce using `vi.spyOn`',
      recommended: false
    },
    messages: {
      useViSpayOn: 'Use `vi.spyOn` instead'
    },
    fixable: 'code',
    schema: []
  },
  defaultOptions: [],
  create(context) {
    return {
      AssignmentExpression(node) {
        const { left, right } = node

        if (left.type !== AST_NODE_TYPES.MemberExpression) return

        const vitestFnCall = getVitestFnCall(right)

        if (!vitestFnCall) return

        context.report({
          node,
          messageId: 'useViSpayOn',
          fix(fixer) {
            const lefPropQuote = left.property.type === AST_NODE_TYPES.Identifier && !left.computed
              ? '\''
              : ''

            const mockImplementation = getAutoFixMockImplementation(vitestFnCall, context)

            return [
              fixer.insertTextBefore(left, 'vi.spyOn('),
              fixer.replaceTextRange(
                [left.object.range[1], left.property.range[0]],
                `, ${lefPropQuote}`
              ),
              fixer.replaceTextRange(
                [left.property.range[1], vitestFnCall.range[1]],
                `${lefPropQuote})${mockImplementation}`
              )
            ]
          }
        })
      }
    }
  }
})
