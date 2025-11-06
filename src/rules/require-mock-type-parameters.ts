import { createEslintRule } from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'

type MESSAGE_IDS = 'noTypeParameter'
export const RULE_NAME = 'require-mock-type-parameters'
type Options = {
  checkImportFunctions?: boolean
}

export default createEslintRule<Options[], MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce using type parameters with vitest mock functions',
      recommended: false,
    },
    messages: {
      noTypeParameter: 'Missing type parameters',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          checkImportFunctions: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [
    {
      checkImportFunctions: false,
    },
  ],
  create(context, [options]) {
    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)
        if (vitestFnCall?.type !== 'vi') return

        for (const member of vitestFnCall.members) {
          if (
            !('name' in member) ||
            // @ts-expect-error TS2339
            member.parent.parent.typeArguments !== undefined
          )
            continue
          if (member.name === 'fn') {
            context.report({
              node: member,
              messageId: 'noTypeParameter',
            })
          }
          if (
            options.checkImportFunctions &&
            ['importActual', 'importMock'].includes(member.name)
          ) {
            context.report({
              node: member,
              messageId: 'noTypeParameter',
            })
          }
        }
      },
    }
  },
})
