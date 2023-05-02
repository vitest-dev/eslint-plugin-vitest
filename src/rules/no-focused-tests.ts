import { createEslintRule } from '../utils'

export type MessageIds = 'noFocusedTests'
export const RULE_NAME = 'no-focused-tests'
export type Options = [];

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
            callee.object.type === 'Identifier' &&
            (callee.object.name === 'it' ||
              callee.object.name === 'describe') &&
            callee.property.type === 'Identifier' &&
            callee.property.name === 'only'
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
            subCallee.object.object.type === 'Identifier' &&
            (subCallee.object.object.name === 'it' ||
              subCallee.object.object.name === 'describe') &&
            subCallee.object.property.type === 'Identifier' &&
            subCallee.object.property.name === 'only' &&
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
