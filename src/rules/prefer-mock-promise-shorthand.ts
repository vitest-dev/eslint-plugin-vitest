import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { AccessorNode, createEslintRule, FunctionExpression, getAccessorValue, getNodeName, isFunction, isSupportedAccessor } from '../utils'

export const RULE_NAME = 'prefer-mock-promise-shorthand'
type MESSAGE_IDS = 'useMockShorthand';
type Options = [];

const withOnce = (name: string, addOnce: boolean): string => {
    return `${name}${addOnce ? 'Once' : ''}`
}

const findSingleReturnArgumentNode = (
    fnNode: FunctionExpression
): TSESTree.Expression | null => {
    if (fnNode.body.type !== AST_NODE_TYPES.BlockStatement)
        return fnNode.body

    if (fnNode.body.body[0]?.type === AST_NODE_TYPES.ReturnStatement)
        return fnNode.body.body[0].argument

    return null
}

export default createEslintRule<Options, MESSAGE_IDS>({
    name: RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Prefer mock resolved/rejected shorthands for promises',
            recommended: 'warn'
        },
        messages: {
            useMockShorthand: 'Prefer {{ replacement }}'
        },
        schema: [],
        fixable: 'code'
    },
    defaultOptions: [],
    create(context) {
        const report = (
            property: AccessorNode,
            isOnce: boolean,
            outerArgNode: TSESTree.Node,
            innerArgNode: TSESTree.Node | null = outerArgNode
        ) => {
            if (innerArgNode?.type !== AST_NODE_TYPES.CallExpression) return

            const argName = getNodeName(innerArgNode)

            if (argName !== 'Promise.resolve' && argName !== 'Promise.reject')
                return

            const replacement = withOnce(argName.endsWith('reject') ? 'mockRejectedValue' : 'mockResolvedValue', isOnce)

            context.report({
                node: property,
                messageId: 'useMockShorthand',
                data: { replacement },
                fix(fixer) {
                    const { sourceCode } = context

                    if (innerArgNode.arguments.length > 1)
                        return null

                    return [
                        fixer.replaceText(property, replacement),
                        fixer.replaceText(outerArgNode, innerArgNode.arguments.length === 1 ? sourceCode.getText(innerArgNode.arguments[0]) : 'undefined')
                    ]
                }
            })
        }

        return {
            CallExpression(node) {
                if (node.callee.type !== AST_NODE_TYPES.MemberExpression ||
                    !isSupportedAccessor(node.callee.property) ||
                    node.arguments.length === 0)
                    return

                const mockFnName = getAccessorValue(node.callee.property)
                const isOnce = mockFnName.endsWith('Once')

                if (mockFnName === withOnce('mockReturnValue', isOnce)) {
                    report(node.callee.property, isOnce, node.arguments[0])
                } else if (mockFnName === withOnce('mockImplementation', isOnce)) {
                    const [arg] = node.arguments

                    if (!isFunction(arg) || arg.params.length !== 0)
                        return

                    report(
                        node.callee.property,
                        isOnce,
                        arg,
                        findSingleReturnArgumentNode(arg)
                    )
                }
            }
        }
    }
})
