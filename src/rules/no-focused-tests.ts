import { TSESTree } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'

export type MessageIds = 'noFocusedTests'
export const RULE_NAME = 'no-focused-tests'
export type Options = []

const isTestOrDescribe = (node: TSESTree.Expression) => {
  return node.type === 'Identifier' && ['it', 'test', 'describe'].includes(node.name)
}

const isOnly = (node: TSESTree.Expression | TSESTree.PrivateIdentifier) => {
  return node.type === 'Identifier' && node.name === 'only'
}

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow focused tests',
      recommended: 'strict'
    },
    fixable: 'code',
    schema: [],
    messages: {
      noFocusedTests: 'Focused tests are not allowed.'
    }
  },
  defaultOptions: [],
  create: (context) => {
    return {
      ExpressionStatement(node) {
        if (node.expression.type === 'CallExpression') {
          const { callee } = node.expression
          if (
            callee.type === 'MemberExpression'
            && isTestOrDescribe(callee.object)
            && isOnly(callee.property)
          ) {
            context.report({
              node: callee.property,
              messageId: 'noFocusedTests'
            })
          }

          if (callee.type === 'TaggedTemplateExpression') {
            const tagCall = callee.tag.type === 'MemberExpression' ? callee.tag.object : null
            if (!tagCall) return

            if (
              tagCall.type === 'MemberExpression'
              && isTestOrDescribe(tagCall.object)
              && isOnly(tagCall.property)
            ) {
              context.report({
                node: tagCall.property,
                messageId: 'noFocusedTests'
              })
            }
          }
        }
      },
      CallExpression(node) {
        if (node.callee.type === 'CallExpression') {
          const { callee } = node.callee

          if (
            callee.type === 'MemberExpression'
            && callee.object.type === 'MemberExpression'
            && isTestOrDescribe(callee.object.object)
            && isOnly(callee.object.property)
            && callee.property.type === 'Identifier'
            && callee.property.name === 'each'
          ) {
            context.report({
              node: callee.object.property,
              messageId: 'noFocusedTests'
            })
          }
        }
      }
    }
  }
})
