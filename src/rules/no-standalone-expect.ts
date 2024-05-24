import { TSESLint, AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getAccessorValue, getNodeName, isFunction } from '../utils'
import { isTypeOfVitestFnCall, parseVitestFnCall } from '../utils/parse-vitest-fn-call'
import { DescribeAlias } from '../utils/types'

export const RULE_NAME = 'no-standalone-expect'
export type MESSAGE_IDS = 'noStandaloneExpect'
type Options = {
  additionalTestBlockFunctions?: string[]
}[]

const getBlockType
  = (statement: TSESTree.BlockStatement,
    context: TSESLint.RuleContext<string, unknown[]>): 'function' | 'describe' | null => {
    const func = statement.parent

    if (!func)
      throw new Error('Unexpected block statement. If you feel like this is a bug report https://github.com/veritem/eslint-plugin-vitest/issues/new')

    if (func.type === AST_NODE_TYPES.FunctionDeclaration)
      return 'function'

    if (isFunction(func) && func.parent) {
      const expr = func.parent

      if (expr.type === AST_NODE_TYPES.VariableDeclarator)
        return 'function'

      if (expr.type === AST_NODE_TYPES.CallExpression
        && isTypeOfVitestFnCall(expr, context, ['describe']))
        return 'describe'
    }
    return null
  }

type BlockType = 'test' | 'function' | 'describe' | 'arrow' | 'template'

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'disallow using `expect` outside of `it` or `test` blocks',
      recommended: 'strict'
    },
    type: 'suggestion',
    messages: {
      noStandaloneExpect: 'Expect must be called inside a test block'
    },
    schema: [
      {
        properties: {
          additionaltestblockfunctions: {
            //@ts-ignore
            type: 'array',
            //@ts-ignore
            items: { type: `string` }
          }
        },
        additionalproperties: false
      }
    ]
  },
  defaultOptions: [{ additionalTestBlockFunctions: [] }],
  create(context, [{ additionalTestBlockFunctions = [] }]) {
    const callStack: BlockType[] = []

    const isCustomTestBlockFunction = (node: TSESTree.CallExpression): boolean =>
      additionalTestBlockFunctions.includes(getNodeName(node) || '')

    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (vitestFnCall?.type === 'expect') {
          if (vitestFnCall.head.node.parent?.type === AST_NODE_TYPES.MemberExpression
            && vitestFnCall.members.length === 1 && !['assertions', 'hasAssertions'].includes(
              getAccessorValue(vitestFnCall.members[0])
            ))
            return

          const parent = callStack[callStack.length - 1]

          if (!parent || parent === DescribeAlias.describe)
            context.report({ node, messageId: 'noStandaloneExpect' })

          return
        }

        if (vitestFnCall?.type === 'test' || isCustomTestBlockFunction(node))
          callStack.push('test')

        if (node.callee.type === AST_NODE_TYPES.TaggedTemplateExpression)
          callStack.push('template')
      },
      'CallExpression:exit'(node: TSESTree.CallExpression) {
        const top = callStack[callStack.length - 1]

        if (
          (top === 'test'
            && (isTypeOfVitestFnCall(node, context, ['test'])
              || isCustomTestBlockFunction(node))
            && node.callee.type !== AST_NODE_TYPES.MemberExpression)
          || (top === 'template'
            && node.callee.type === AST_NODE_TYPES.TaggedTemplateExpression)
        )
          callStack.pop()
      },
      BlockStatement(statement) {
        const blockType = getBlockType(statement, context)
        if (blockType)
          callStack.push(blockType)
      },
      'BlockStatement:exit'(statement) {
        const blockType = getBlockType(statement, context)
        if (blockType)
          callStack.pop()
      },
      ArrowFunctionExpression(node) {
        if (node.parent?.type !== AST_NODE_TYPES.CallExpression)
          callStack.push('arrow')
      },
      'ArrowFunctionExpression:exit'() {
        if (callStack[callStack.length - 1] === 'arrow')
          callStack.pop()
      }
    }
  }
})
