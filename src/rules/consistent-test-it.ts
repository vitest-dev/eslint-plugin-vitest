import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'
import { isTypeOfVitestFnCall, parseVitestFnCall } from '../utils/parseVitestFnCall'
import { TestCaseName } from '../utils/types'

export const RULE_NAME = 'consistent-test-it'
export type MessageIds = 'consistentMethod' | 'consistentMethodWithinDescribe';

const buildFixer =
    (
        callee: TSESTree.LeftHandSideExpression,
        nodeName: string,
        preferredTestKeyword: TestCaseName.test | TestCaseName.it
    ) =>
        (fixer: TSESLint.RuleFixer) =>
            [
                fixer.replaceText(
                    callee.type === AST_NODE_TYPES.MemberExpression
                        ? callee.object
                        : callee,
                    getPreferredNodeName(nodeName, preferredTestKeyword)
                )
            ]

function getPreferredNodeName(
    nodeName: string,
    preferredTestKeyword: TestCaseName.test | TestCaseName.it
) {
    if (nodeName === TestCaseName.fit)
        return 'test.only'

    return nodeName.startsWith('f') || nodeName.startsWith('x')
        ? nodeName.charAt(0) + preferredTestKeyword
        : preferredTestKeyword
}

function getOppositeTestKeyword(test: TestCaseName.test | TestCaseName.it) {
    if (test === TestCaseName.test)
        return TestCaseName.it

    return TestCaseName.test
}

export default createEslintRule<
    [
        Partial<{
            fn: TestCaseName.it | TestCaseName.test;
            withinDescribe: TestCaseName.it | TestCaseName.test;
        }>
    ],
    MessageIds
>({
    name: RULE_NAME,
    meta: {
        type: 'suggestion',
        fixable: 'code',
        docs: {
            description: 'Prefer test or it but not both',
            recommended: 'warn'
        },
        messages: {
            consistentMethod:
                'Prefer using {{ testFnKeyWork }} instead of {{ oppositeTestKeyword }}',
            consistentMethodWithinDescribe:
                'Prefer using {{ testKeywordWithinDescribe }} instead of {{ oppositeTestKeyword }} within describe'
        },
        schema: [
            {
                type: 'object',
                properties: {
                    fn: {
                        enum: [TestCaseName.test, TestCaseName.it]
                    },
                    withinDescribe: {
                        enum: [TestCaseName.test, TestCaseName.it]
                    }
                },
                additionalProperties: false
            }
        ]
    },
    defaultOptions: [{ fn: TestCaseName.test, withinDescribe: TestCaseName.it }],
    create(context) {
        const config = context.options[0] ?? {}
        const testFnKeyWork = config.fn || TestCaseName.test
        const testKeywordWithinDescribe = config?.withinDescribe || config?.fn || TestCaseName?.it
        const testFnDisabled = testFnKeyWork === testKeywordWithinDescribe ? testFnKeyWork : undefined

        let describeNestingLevel = 0

        return {
            ImportDeclaration(node: TSESTree.ImportDeclaration) {
                if (testFnDisabled == null)
                    return
                if (node.source.type !== 'Literal' || node.source.value !== 'vitest')
                    return

                const oppositeTestKeyword = getOppositeTestKeyword(testFnDisabled)
                for (const specifier of node.specifiers) {
                    if (specifier.type !== 'ImportSpecifier')
                        continue
                    if (specifier.local.name !== specifier.imported.name)
                        continue
                    if (specifier.local.name === oppositeTestKeyword) {
                        context.report({
                            node: specifier,
                            data: { testFnKeyWork, oppositeTestKeyword },
                            messageId: 'consistentMethod',
                            fix: (fixer) => fixer.replaceText(
                                specifier.local,
                                testFnDisabled
                            )
                        })
                    }
                }
            },
            CallExpression(node: TSESTree.CallExpression) {
                const vitestFnCall = parseVitestFnCall(node, context)

                if (!vitestFnCall) return

                if (vitestFnCall.type === 'describe') {
                    describeNestingLevel++
                    return
                }

                const funcNode = node.callee.type === AST_NODE_TYPES.TaggedTemplateExpression
                    ? node.callee.tag
                    : node.callee.type === AST_NODE_TYPES.CallExpression
                        ? node.callee.callee
                        : node.callee
                if (vitestFnCall.type === 'test' &&
                    describeNestingLevel === 0 &&
                    !vitestFnCall.name.endsWith(testFnKeyWork)) {
                    const oppositeTestKeyword = getOppositeTestKeyword(testFnKeyWork)

                    context.report({
                        node: node.callee,
                        data: { testFnKeyWork, oppositeTestKeyword },
                        messageId: 'consistentMethod',
                        fix: buildFixer(funcNode, vitestFnCall.name, testFnKeyWork)
                    })
                } else if (vitestFnCall.type === 'test' &&
                    describeNestingLevel > 0 &&
                    !vitestFnCall.name.endsWith(testKeywordWithinDescribe)) {
                    const oppositeTestKeyword = getOppositeTestKeyword(testKeywordWithinDescribe)

                    context.report({
                        messageId: 'consistentMethodWithinDescribe',
                        node: node.callee,
                        data: { testKeywordWithinDescribe, oppositeTestKeyword },
                        fix: buildFixer(funcNode, vitestFnCall.name, testKeywordWithinDescribe)
                    })
                }
            },
            'CallExpression:exit'(node) {
                if (isTypeOfVitestFnCall(node, context, ['describe']))
                    describeNestingLevel--
            }
        }
    }
})
