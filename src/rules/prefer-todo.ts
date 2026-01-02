import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils'
import {
  createEslintRule,
  getAccessorValue,
  isFunction,
  isStringNode,
  replaceAccessorFixer,
} from '../utils'
import {
  ParsedVitestFnCall,
  parseVitestFnCall,
} from '../utils/parse-vitest-fn-call'
import { hasOnlyOneArgument } from '../utils/msc'

const RULE_NAME = 'prefer-todo'

type MESSAGE_IDS = 'emptyTest' | 'unimplementedTest'

type Options = []

const isTargetedTestCase = (vitestFnCall: ParsedVitestFnCall) => {
  if (vitestFnCall.members.some((s) => getAccessorValue(s) !== 'skip'))
    return false

  if (vitestFnCall.name.startsWith('x')) return false

  return !vitestFnCall.name.startsWith('f')
}

function isEmptyFunction(node: TSESTree.CallExpressionArgument) {
  if (!isFunction(node)) return false

  return (
    node.body.type === AST_NODE_TYPES.BlockStatement && !node.body.body.length
  )
}

function createTodoFixer(
  vitestFnCall: ParsedVitestFnCall,
  fixer: TSESLint.RuleFixer,
) {
  if (vitestFnCall.members.length)
    return replaceAccessorFixer(fixer, vitestFnCall.members[0], 'todo')

  return fixer.replaceText(
    vitestFnCall.head.node,
    `${vitestFnCall.head.local}.todo`,
  )
}

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce using `test.todo`',
      recommended: false,
    },
    messages: {
      emptyTest: 'Prefer todo test case over empty test case',
      unimplementedTest: 'Prefer todo test case over unimplemented test case',
    },
    fixable: 'code',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const [title, callback] = node.arguments

        const vitestFnCall = parseVitestFnCall(node, context)

        if (
          !title ||
          vitestFnCall?.type !== 'test' ||
          !isTargetedTestCase(vitestFnCall) ||
          !isStringNode(title)
        )
          return

        if (callback && isEmptyFunction(callback)) {
          context.report({
            messageId: 'emptyTest',
            node,
            fix: (fixer) => [
              fixer.removeRange([title.range[1], callback.range[1]]),
              createTodoFixer(vitestFnCall, fixer),
            ],
          })
        }

        if (hasOnlyOneArgument(node)) {
          context.report({
            messageId: 'unimplementedTest',
            node,
            fix: (fixer) => createTodoFixer(vitestFnCall, fixer),
          })
        }
      },
    }
  },
})
