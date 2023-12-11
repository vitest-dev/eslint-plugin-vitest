import { TSESLint, AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getNodeName, isFunction, isSupportedAccessor } from '../utils'
import { isTypeOfVitestFnCall, parseVitestFnCall } from '../utils/parseVitestFnCall'

export const RULE_NAME = 'no-done-callback'
export type MessageIds = 'noDoneCallback' | 'suggestWrappingInPromise' | 'useAwaitInsteadOfCallback';
export type Options = [];

const findCallbackArg = (node: TSESTree.CallExpression, isVitestEach: boolean, context: TSESLint.RuleContext<string, unknown[]>): TSESTree.CallExpression['arguments'][0] | null => {
	if (isVitestEach)
		return node.arguments[1]

	const vitestFnCall = parseVitestFnCall(node, context)

	if (vitestFnCall?.type === 'hook' && node.arguments.length >= 1)
		return node.arguments[0]

	if (vitestFnCall?.type === 'test' && node.arguments.length >= 2)
		return node.arguments[1]

	return null
}

export default createEslintRule<Options, MessageIds>({
	name: RULE_NAME,
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallow using a callback in asynchronous tests and hooks',
			recommended: 'error'
		},
		schema: [],
		messages: {
			noDoneCallback: 'Return a promise instead of relying on callback parameter',
			suggestWrappingInPromise: 'Wrap in `new Promise({{ callback }} => ...`',
			useAwaitInsteadOfCallback: 'Use `await` instead of callback in async function'
		},
		hasSuggestions: true
	},
	defaultOptions: [],
	create(context) {
		return {
			CallExpression(node) {
				const isVitestEach = /\.each$|\.concurrent$/.test(getNodeName(node.callee) ?? '')

				if (isVitestEach && node.callee.type !== AST_NODE_TYPES.TaggedTemplateExpression)
					return

				const isInsideConcurrentTestOrDescribe = context.getAncestors().some((ancestor) => {
					if (ancestor.type !== AST_NODE_TYPES.CallExpression) return false
			
					const isNotInsideDescribeOrTest = !isTypeOfVitestFnCall(ancestor, context, ['describe', 'test'])
					if (isNotInsideDescribeOrTest) return false
			
					const isTestRunningConcurrently =
						ancestor.callee.type === AST_NODE_TYPES.MemberExpression &&
						isSupportedAccessor(ancestor.callee.property, 'concurrent')
			
					return isTestRunningConcurrently
				})

				if (isInsideConcurrentTestOrDescribe) return;

				const callback = findCallbackArg(node, isVitestEach, context)
				const callbackArgIndex = Number(isVitestEach)

				if (!callback ||
					!isFunction(callback) || callback.params.length !== 1 + callbackArgIndex)
					return

				const argument = callback.params[callbackArgIndex]

				if (argument.type !== AST_NODE_TYPES.Identifier) {
					context.report({
						node: argument,
						messageId: 'noDoneCallback'
					})
					return
				}

				if (callback.async) {
					context.report({
						node: argument,
						messageId: 'useAwaitInsteadOfCallback'
					})
					return
				}

				context.report({
					node,
					messageId: 'noDoneCallback',
					suggest: [
						{
							messageId: 'suggestWrappingInPromise',
							data: { callback: argument.name },
							fix(fixer) {
								const { body, params } = callback

								const sourceCode = context.getSourceCode()
								const firstBodyToken = sourceCode.getFirstToken(body)
								const lastBodyToken = sourceCode.getLastToken(body)

								const [firstParam] = params
								const lastParam = params[params.length - 1]

								const tokenBeforeFirstParam = sourceCode.getTokenBefore(firstParam)
								let tokenAfterLastParam = sourceCode.getTokenAfter(lastParam)

								if (tokenAfterLastParam?.value === ',')
									tokenAfterLastParam = sourceCode.getTokenAfter(tokenAfterLastParam)

								if (!firstBodyToken ||
									!lastBodyToken ||
									!tokenBeforeFirstParam ||
									!tokenAfterLastParam)
									throw new Error(`Unexpected null when attempting to fix ${context.getFilename()} - please file an issue at https://github/veritem/eslint-plugin-vitest`)

								let argumentFix = fixer.replaceText(firstParam, '()')

								if (tokenBeforeFirstParam.value === '(' && tokenAfterLastParam.value === ')')
									argumentFix = fixer.removeRange([tokenBeforeFirstParam.range[1], tokenAfterLastParam.range[0]])

								const newCallBack = argument.name

								let beforeReplacement = `new Promise(${newCallBack} => `
								let afterReplacement = ')'
								let replaceBefore = true

								if (body.type === AST_NODE_TYPES.BlockStatement) {
									const keyword = 'return'

									beforeReplacement = `${keyword} ${beforeReplacement}{`
									afterReplacement += '}'
									replaceBefore = false
								}

								return [
									argumentFix,
									replaceBefore
										? fixer.insertTextBefore(firstBodyToken, beforeReplacement)
										: fixer.insertTextAfter(firstBodyToken, beforeReplacement),
									fixer.insertTextAfter(lastBodyToken, afterReplacement)
								]
							}
						}
					]
				})
			}
		}
	}
})
