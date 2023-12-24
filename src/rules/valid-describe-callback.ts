import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getAccessorValue, isFunction } from '../utils'
import { parseVitestFnCall } from '../utils/parseVitestFnCall'

export const RULE_NAME = 'valid-describe-callback'
type MESSAGE_IDS =
    | 'nameAndCallback'
    | 'secondArgumentMustBeFunction'
    | 'noAsyncDescribeCallback'
    | 'unexpectedDescribeArgument'
    | 'unexpectedReturnInDescribe'

type Options = [];

const paramsLocation = (params: TSESTree.CallExpressionArgument[] | TSESTree.Parameter[]) => {
    const [first] = params
    const last = params[params.length - 1]

    return {
        start: first.loc.start,
        end: last.loc.end
    }
}

export default createEslintRule<Options, MESSAGE_IDS>({
    name: RULE_NAME,
    meta: {
        type: 'problem',
        docs: {
            description: 'Enforce valid describe callback',
            recommended: 'strict'
        },
        messages: {
            nameAndCallback: 'Describe requires a name and callback arguments',
            secondArgumentMustBeFunction: 'Second argument must be a function',
            noAsyncDescribeCallback: 'Describe callback cannot be async',
            unexpectedDescribeArgument: 'Unexpected argument in describe callback',
            unexpectedReturnInDescribe: 'Unexpected return statement in describe callback'
        },
        schema: []
    },
    defaultOptions: [],
    create(context) {
        return {
            CallExpression(node) {
                const vitestFnCall = parseVitestFnCall(node, context)

                if (vitestFnCall?.type !== 'describe') return

				if(vitestFnCall?.members[0]?.type === AST_NODE_TYPES.Identifier && vitestFnCall.members[0].name === "todo") {
					return 
				}

                if (node.arguments.length < 1) {
                    return context.report({
                        messageId: 'nameAndCallback',
                        loc: node.loc
                    })
                }

                const [, callback] = node.arguments

                if (!callback) {
                    context.report({
                        messageId: 'nameAndCallback',
                        loc: paramsLocation(node.arguments)
                    })
                    return
                }

                if (!isFunction(callback)) {
                    context.report({
                        messageId: 'secondArgumentMustBeFunction',
                        loc: paramsLocation(node.arguments)
                    })
                    return
                }

                if (callback.async) {
                    context.report({
                        messageId: 'noAsyncDescribeCallback',
                        node: callback
                    })
                }

                if (vitestFnCall.members.every(s => getAccessorValue(s) !== 'each') &&
                    callback.params.length) {
                    context.report({
                        messageId: 'unexpectedDescribeArgument',
                        node: callback
                    })
                }

                if (callback.body.type === AST_NODE_TYPES.CallExpression) {
                    context.report({
                        messageId: 'unexpectedReturnInDescribe',
                        node: callback
                    })
                }

                if (callback.body.type === AST_NODE_TYPES.BlockStatement) {
                    callback.body.body.forEach(node => {
                        if (node.type === AST_NODE_TYPES.ReturnStatement) {
                            context.report({
                                messageId: 'unexpectedReturnInDescribe',
                                node
                            })
                        }
                    })
                }
            }
        }
    }
})
