import { createEslintRule } from '../utils'
import { isTypeOfVitestFnCall } from '../utils/parseVitestFnCall'

export const RULE_NAME = 'no-conditional-in-test'
export type MESSAGE_IDS = 'noConditionalInTest';
export type Options = [];

export default createEslintRule<Options, MESSAGE_IDS>({
    name: RULE_NAME,
    meta: {
        docs: {
            description: 'Disallow conditional tests',
            requiresTypeChecking: false,
            recommended: 'warn'
        },
        messages: {
            noConditionalInTest: 'Remove conditional tests'
        },
        schema: [],
        type: 'problem'
    },
    defaultOptions: [],
    create(context) {
        return {
			IfStatement(node) {
				if(node.parent?.parent?.parent?.type === "CallExpression" && isTypeOfVitestFnCall(node.parent?.parent?.parent, context, ['test','it'])) {
					context.report({ messageId: 'noConditionalInTest', node })
				}
			},
        }
    }
})