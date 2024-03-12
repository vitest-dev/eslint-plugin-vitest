import { createEslintRule, getStringValue, isStringNode, isSupportedAccessor } from '../utils'
import { isTypeOfVitestFnCall, parseVitestFnCall } from '../utils/parseVitestFnCall'

export const RULE_NAME = 'no-identical-title'
export type MESSAGE_ID = 'multipleTestTitle' | 'multipleDescribeTitle';
export type Options = [];

interface DescribeContext {
    describeTitles: string[];
    testTitles: string[];
}

const newDescribeContext = (): DescribeContext => ({
    describeTitles: [],
    testTitles: []
})

export default createEslintRule<Options, MESSAGE_ID>({
    name: RULE_NAME,
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow identical titles',
            recommended: 'strict'
        },
        fixable: 'code',
        schema: [],
        messages: {
            multipleTestTitle: 'Test is used multiple times in the same describe(suite) block',
            multipleDescribeTitle: 'Describe is used multiple times in the same describe(suite) block'
        }
    },
    defaultOptions: [],
    create(context) {
        const stack = [newDescribeContext()]
        return {
            CallExpression(node) {
                const currentStack = stack[stack.length - 1]

                const vitestFnCall = parseVitestFnCall(node, context)

                if (!vitestFnCall)
                    return

                if (vitestFnCall.name === 'describe' || vitestFnCall.name === 'suite')
                    stack.push(newDescribeContext())

                if (vitestFnCall.members.find(s => isSupportedAccessor(s, 'each')))
                    return

                const [argument] = node.arguments

                if (!argument || !isStringNode(argument))
                    return

                const title = getStringValue(argument)

                if (vitestFnCall.type === 'test') {
                    if (currentStack?.testTitles.includes(title)) {
                        context.report({
                            node,
                            messageId: 'multipleTestTitle'
                        })
                    }
                    currentStack?.testTitles.push(title)
                }

                if (vitestFnCall.type !== 'describe')
                    return

                if (currentStack?.describeTitles.includes(title)) {
                    context.report({
                        node,
                        messageId: 'multipleDescribeTitle'
                    })
                }
                currentStack?.describeTitles.push(title)
            },
            'CallExpression:exit'(node) {
                if (isTypeOfVitestFnCall(node, context, ['describe']))
                    stack.pop()
            }
        }
    }
})
