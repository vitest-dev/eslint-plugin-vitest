import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'
import { parsePluginSettings } from '../utils/parse-plugin-settings'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'
import { getModuleScope } from '../utils/scope'
import { isClassOrFunctionType } from '../utils/types'

export const RULE_NAME = 'prefer-describe-function-title'
export type MESSAGE_IDS = 'preferFunction'
export type Options = []

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description:
        'enforce using a function as a describe title over an equivalent string',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferFunction: 'Enforce using a function over an equivalent string',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (node.arguments.length < 2) {
          return
        }

        const [argument] = node.arguments
        if (
          argument.type !== AST_NODE_TYPES.Literal ||
          typeof argument.value !== 'string'
        ) {
          return
        }

        const describedTitle = argument.value
        // if (!context.filename.includes(`${describedTitle}.`)) {
        //   return
        // }

        const vitestFnCall = parseVitestFnCall(node, context)
        if (vitestFnCall?.type !== 'describe') {
          return
        }

        const scope = getModuleScope(context, node)
        const scopedFunction = scope?.set.get(describedTitle)?.defs[0]
        if (scopedFunction?.type !== 'ImportBinding') {
          return
        }

        const settings = parsePluginSettings(context.settings)
        if (settings.typecheck) {
          const services = ESLintUtils.getParserServices(context)
          const type = services.getTypeAtLocation(scopedFunction.node)

          if (!isClassOrFunctionType(type)) {
            return
          }
        }

        context.report({
          node: argument,
          messageId: 'preferFunction',
          fix(fixer) {
            return fixer.replaceText(argument, describedTitle)
          },
        })
      },
    }
  },
})
