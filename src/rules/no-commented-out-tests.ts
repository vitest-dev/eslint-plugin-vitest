import { TSESTree } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'

const RULE_NAME = 'no-commented-out-tests'
export type MESSAGE_IDS = 'noCommentedOutTests'
export type Options = []

function hasTests(node: TSESTree.Comment) {
  return /^\s*[xf]?(test|it|describe)(\.\w+|\[['"]\w+['"]\])?\s*\(/mu.test(
    node.value,
  )
}

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'disallow commented out tests',
      requiresTypeChecking: false,
      recommended: false,
    },
    messages: {
      noCommentedOutTests:
        'Remove commented out tests - you may want to use `skip` or `only` instead',
    },
    schema: [],
    type: 'suggestion',
  },
  create(context) {
    const { sourceCode } = context

    function checkNodeForCommentedOutTests(node: TSESTree.Comment) {
      if (!hasTests(node)) return
      context.report({ messageId: 'noCommentedOutTests', node })
    }

    return {
      Program() {
        const comments = sourceCode.getAllComments()
        comments.forEach(checkNodeForCommentedOutTests)
      },
    }
  },
})
