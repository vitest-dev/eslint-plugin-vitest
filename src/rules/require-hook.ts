import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getNodeName, isFunction, isIdentifier } from '../utils'
import { isTypeOfVitestFnCall, parseVitestFnCall } from '../utils/parseVitestFnCall'

export const RULE_NAME = 'require-hook'
type MESSAGE_IDS = 'useHook'
type Options = [{ allowedFunctionCalls?: readonly string[] }]

const isVitestFnCall = (
    node: TSESTree.CallExpression,
    context: TSESLint.RuleContext<string, unknown[]>
) => {
    if (parseVitestFnCall(node, context))
        return true

    return !!getNodeName(node)?.startsWith('vi')
}

const isNullOrUndefined = (node: TSESTree.Expression) => {
    return (node.type === AST_NODE_TYPES.Literal && node.value === null) || isIdentifier(node, 'undefined')
}

const shouldBeInHook = (
    node: TSESTree.Node,
    context: TSESLint.RuleContext<string, unknown[]>,
    allowedFunctionCalls: readonly string[] = []
): boolean => {
    switch (node.type) {
        case AST_NODE_TYPES.ExpressionStatement:
            return shouldBeInHook(node.expression, context, allowedFunctionCalls)
        case AST_NODE_TYPES.CallExpression:
            return !(isVitestFnCall(node, context) || allowedFunctionCalls.includes(getNodeName(node) as string))
        case AST_NODE_TYPES.VariableDeclaration: {
            if (node.kind === 'const')
                return false

            return node.declarations.some(
                ({ init }) => init !== null && !isNullOrUndefined(init)
            )
        }
        default:
            return false
    }
}

export default createEslintRule<Options, MESSAGE_IDS>({
    name: RULE_NAME,
    meta: {
        docs: {
            description: 'Require setup and teardown to be within a hook',
            recommended: 'warn'
        },
        messages: {
            useHook: 'This should be done within a hook'
        },
        type: 'suggestion',
        schema: [
            {
                type: 'object',
                properties: {
                    allowedFunctionCalls: {
                        type: 'array',
                        items: { type: 'string' }
                    }
                },
                additionalProperties: false
            }
        ]
    },
    defaultOptions: [
        {
            allowedFunctionCalls: []
        }
    ],
    create(context) {
        const { allowedFunctionCalls } = context.options[0] ?? {}

        const checkBlockBody = (body: TSESTree.BlockStatement['body']) => {
            for (const statement of body) {
                if (shouldBeInHook(statement, context, allowedFunctionCalls)) {
                    context.report({
                        node: statement,
                        messageId: 'useHook'
                    })
                }
            }
        }

        return {
            Program(program) {
                checkBlockBody(program.body)
            },
            CallExpression(node) {
                if (!isTypeOfVitestFnCall(node, context, ['describe']) || node.arguments.length < 2) return

                const [, testFn] = node.arguments

                if (!isFunction(testFn) ||
                    testFn.body.type !== AST_NODE_TYPES.BlockStatement) return

                checkBlockBody(testFn.body.body)
            }
        }
    }
})
