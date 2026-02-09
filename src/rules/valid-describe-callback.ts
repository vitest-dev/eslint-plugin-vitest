import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import {
  createEslintRule,
  FunctionExpression,
  getAccessorValue,
  isFunction,
} from '../utils'
import {
  ParsedVitestFnCall,
  parseVitestFnCall,
} from '../utils/parse-vitest-fn-call'
import { RuleContext } from '@typescript-eslint/utils/ts-eslint'

const RULE_NAME = 'valid-describe-callback'
type MESSAGE_IDS =
  | 'nameAndCallback'
  | 'secondArgumentMustBeFunction'
  | 'unexpectedDescribeArgument'
  | 'unexpectedReturnInDescribe'

type Options = []

const paramsLocation = (
  params: TSESTree.CallExpressionArgument[] | TSESTree.Parameter[],
) => {
  const [first] = params
  const last = params[params.length - 1]

  return {
    start: first.loc.start,
    end: last.loc.end,
  }
}

const hasNonEachMembersAndParams = (
  vitestFnCall: ParsedVitestFnCall,
  functionExpression: FunctionExpression,
) => {
  return (
    vitestFnCall.members.every(
      (s) => !['each', 'for'].includes(getAccessorValue(s)),
    ) && functionExpression.params.length
  )
}

const reportUnexpectedReturnInDescribe = (
  blockStatement: TSESTree.BlockStatement,
  context: Readonly<RuleContext<MESSAGE_IDS, []>>,
) => {
  blockStatement.body.forEach((node) => {
    if (node.type !== AST_NODE_TYPES.ReturnStatement) return

    context.report({
      messageId: 'unexpectedReturnInDescribe',
      node,
    })
  })
}

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce valid describe callback',
      recommended: false,
    },
    messages: {
      nameAndCallback: 'Describe requires a name and callback arguments',
      secondArgumentMustBeFunction: 'Second argument must be a function',
      unexpectedDescribeArgument: 'Unexpected argument in describe callback',
      unexpectedReturnInDescribe:
        'Unexpected return statement in describe callback',
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (vitestFnCall?.type !== 'describe') return

        if (
          vitestFnCall?.members[0]?.type === AST_NODE_TYPES.Identifier &&
          vitestFnCall.members[0].name === 'todo'
        )
          return

        if (node.arguments.length < 1) {
          return context.report({
            messageId: 'nameAndCallback',
            loc: node.loc,
          })
        }

        const [, arg2, arg3] = node.arguments

        if (!arg2) {
          context.report({
            messageId: 'nameAndCallback',
            loc: paramsLocation(node.arguments),
          })
          return
        }

        if (!isFunction(arg2)) {
          if (arg3 && isFunction(arg3)) {
            if (hasNonEachMembersAndParams(vitestFnCall, arg3)) {
              context.report({
                messageId: 'unexpectedDescribeArgument',
                node: arg3,
              })
            }

            if (arg3.body.type === AST_NODE_TYPES.CallExpression) {
              context.report({
                messageId: 'unexpectedReturnInDescribe',
                node: arg3,
              })
            }

            if (arg3.body.type === AST_NODE_TYPES.BlockStatement) {
              reportUnexpectedReturnInDescribe(arg3.body, context)
            }

            return
          }

          context.report({
            messageId: 'secondArgumentMustBeFunction',
            loc: paramsLocation(node.arguments),
          })
          return
        }

        if (hasNonEachMembersAndParams(vitestFnCall, arg2)) {
          context.report({
            messageId: 'unexpectedDescribeArgument',
            node: arg2,
          })
        }

        if (arg2.body.type === AST_NODE_TYPES.CallExpression) {
          context.report({
            messageId: 'unexpectedReturnInDescribe',
            node: arg2,
          })
        }

        if (arg2.body.type === AST_NODE_TYPES.BlockStatement) {
          reportUnexpectedReturnInDescribe(arg2.body, context)
        }
      },
    }
  },
})
