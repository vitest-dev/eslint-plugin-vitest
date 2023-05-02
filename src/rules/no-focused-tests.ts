import { createEslintRule } from '../utils'
import { TSESTree } from '@typescript-eslint/utils'

export type MessageIds = 'noFocusedTests'
export const RULE_NAME = 'no-focused-tests'
export type Options = [];

const isTestOrDescribe = (node: TSESTree.Expression) => {
  return node.type === 'Identifier' && ['it', 'test', 'describe'].includes(node.name)
}

const isOnly = (node: TSESTree.Expression|TSESTree.PrivateIdentifier) => {
  return node.type === 'Identifier' && node.name === 'only'
}

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow focused tests',
      recommended: 'error'
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
            callee.type === 'MemberExpression' &&
            isTestOrDescribe(callee.object) &&
            isOnly(callee.property)
          ) {
            context.report({
              node: callee.property,
              messageId: 'noFocusedTests'
            })
          }

          if (callee.type !== 'CallExpression') return;

          const subCallee = callee.callee

          if (
            subCallee.type === 'MemberExpression' &&
            subCallee.object.type === 'MemberExpression' &&
            isTestOrDescribe(subCallee.object.object) &&
            isOnly(subCallee.object.property) &&
            subCallee.property.type === 'Identifier' &&
            subCallee.property.name === 'each'
          ) {
            context.report({
              node: subCallee.object.property,
              messageId: 'noFocusedTests'
            })
          }
        }
      }
    }
  }
})
