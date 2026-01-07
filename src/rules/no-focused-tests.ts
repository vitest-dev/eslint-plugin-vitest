import { TSESTree } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'

export type MessageIds = 'noFocusedTests'
const RULE_NAME = 'no-focused-tests'
export type Options = [
  Partial<{
    fixable: boolean
  }>,
]

const isTestOrDescribe = (node: TSESTree.Expression) => {
  return (
    node.type === 'Identifier' && ['it', 'test', 'describe'].includes(node.name)
  )
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
      recommended: false,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          fixable: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ], defaultOptions: [],
    messages: {
      noFocusedTests: 'Focused tests are not allowed',
    },
  },
  defaultOptions: [{ fixable: true }],
  create: (context, options) => {
    const fixable = options[0].fixable!

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
              messageId: 'noFocusedTests',
              fix: (fixer) =>
                fixable
                  ? fixer.removeRange([
                      callee.property.range[0] - 1,
                      callee.property.range[1],
                    ])
                  : null,
            })
          }

          if (callee.type === 'TaggedTemplateExpression') {
            const tagCall =
              callee.tag.type === 'MemberExpression' ? callee.tag.object : null
            if (!tagCall) return

            if (
              tagCall.type === 'MemberExpression' &&
              isTestOrDescribe(tagCall.object) &&
              isOnly(tagCall.property)
            ) {
              context.report({
                node: tagCall.property,
                messageId: 'noFocusedTests',
                fix: (fixer) =>
                  fixable
                    ? fixer.removeRange([
                        tagCall.property.range[0] - 1,
                        tagCall.property.range[1],
                      ])
                    : null,
              })
            }
          }
        }
      },
      CallExpression(node) {
        if (node.callee.type === 'CallExpression') {
          const { callee } = node.callee

          if (
            callee.type === 'MemberExpression' &&
            callee.object.type === 'MemberExpression' &&
            isTestOrDescribe(callee.object.object) &&
            isOnly(callee.object.property) &&
            callee.property.type === 'Identifier' &&
            callee.property.name === 'each'
          ) {
            const onlyCallee = callee.object.property

            context.report({
              node: callee.object.property,
              messageId: 'noFocusedTests',
              fix: (fixer) =>
                fixable
                  ? fixer.removeRange([
                      onlyCallee.range[0] - 1,
                      onlyCallee.range[1],
                    ])
                  : null,
            })
          }
        }
      },
    }
  },
})
