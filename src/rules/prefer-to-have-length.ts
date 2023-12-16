import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { createEslintRule, getAccessorValue, isSupportedAccessor } from '../utils'
import { parseVitestFnCall } from '../utils/parseVitestFnCall'
import { EqualityMatcher } from '../utils/types'

export type MESSAGE_IDS = 'preferToHaveLength';
export const RULE_NAME = 'prefer-to-have-length'
type Options = []

export default createEslintRule<Options, MESSAGE_IDS>({
    name: RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Suggest using toHaveLength()',
            recommended: false
        },
        fixable: 'code',
        messages: {
            preferToHaveLength: 'Prefer toHaveLength()'
        },
        schema: []
    },
    defaultOptions: [],
    create(context) {
        return {
            CallExpression(node) {
                const vitestFnCall = parseVitestFnCall(node, context)

                if (vitestFnCall?.type !== 'expect')
                    return

                const { parent: expect } = vitestFnCall.head.node

                if (expect?.type !== AST_NODE_TYPES.CallExpression)
                    return

                const [argument] = expect.arguments
                const { matcher } = vitestFnCall

                // eslint-disable-next-line no-prototype-builtins
                if (!EqualityMatcher.hasOwnProperty(getAccessorValue(matcher)) ||
                    argument?.type !== AST_NODE_TYPES.MemberExpression ||
                    !isSupportedAccessor(argument.property, 'length'))
                    return

                context.report({
                    node: matcher,
                    messageId: 'preferToHaveLength',
                    fix(fixer) {
                        return [
                            fixer.removeRange([
                                argument.property.range[0] - 1,
                                argument.range[1]
                            ]),

                            fixer.replaceTextRange(
                                [matcher.parent.object.range[1], matcher.parent.range[1]],
                                '.toHaveLength'
                            )
                        ]
                    }
                })
            }
        }
    }
})
