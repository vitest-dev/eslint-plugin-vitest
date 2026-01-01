import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { AccessorNode, createEslintRule, getAccessorValue } from '../utils'
import {
  KnownMemberExpressionProperty,
  parseVitestFnCall,
} from '../utils/parse-vitest-fn-call'

const RULE_NAME = 'require-awaited-expect-poll'
export type MESSAGE_ID = 'notAwaited'
export type Options = []

export default createEslintRule<Options, MESSAGE_ID>({
  name: RULE_NAME,
  meta: {
    docs: {
      requiresTypeChecking: false,
      recommended: false,
      description: 'ensure that every `expect.poll` call is awaited',
    },
    messages: {
      notAwaited: '`{{ method }}` calls should be awaited',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const reported = new Set<TSESTree.Node>()

    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (
          vitestFnCall?.type !== 'expect' ||
          !vitestFnCall.members.length ||
          !memberRequiresAwait(vitestFnCall.members[0])
        ) {
          return
        }

        const nodeToReport = vitestFnCall.members[0].parent

        if (reported.has(nodeToReport)) {
          return
        }

        const topMostNode = skipSequenceExpressions(
          skipMatchersAndModifiers(vitestFnCall.head.node),
        )

        const isHandled =
          topMostNode.parent?.type === AST_NODE_TYPES.AwaitExpression ||
          topMostNode.parent?.type === AST_NODE_TYPES.ReturnStatement

        if (isHandled) {
          return
        }

        context.report({
          node: nodeToReport,
          messageId: 'notAwaited',
          data: {
            method: `expect.${getAccessorValue(vitestFnCall.members[0])}`,
          },
        })

        reported.add(nodeToReport)
      },
    }
  },
})

const awaitedMembers = ['poll', 'element']

function memberRequiresAwait(member: KnownMemberExpressionProperty): boolean {
  return awaitedMembers.includes(getAccessorValue(member))
}

function skipMatchersAndModifiers(node: AccessorNode): TSESTree.Node {
  let currentNode: TSESTree.Node = node

  while (
    currentNode.parent.type === AST_NODE_TYPES.MemberExpression ||
    currentNode.parent.type === AST_NODE_TYPES.CallExpression
  ) {
    currentNode = currentNode.parent
  }

  return currentNode
}

function skipSequenceExpressions(node: TSESTree.Node): TSESTree.Node {
  let currentNode: TSESTree.Node = node

  while (
    currentNode.parent?.type === AST_NODE_TYPES.SequenceExpression &&
    currentNode.parent.expressions.at(-1) === currentNode
  ) {
    currentNode = currentNode.parent
  }

  return currentNode
}
