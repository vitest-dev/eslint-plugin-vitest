import { TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getAccessorValue } from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'

const RULE_NAME = 'consistent-each-for'
export type MessageIds = 'consistentMethod'

type EachOrFor = 'each' | 'for'

const BASE_FN_NAMES = ['test', 'it', 'describe', 'suite']

type Options = {
  test?: EachOrFor
  it?: EachOrFor
  describe?: EachOrFor
  suite?: EachOrFor
}

export default createEslintRule<[Partial<Options>], MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce using `.each` or `.for` consistently',
      recommended: false,
    },
    messages: {
      consistentMethod:
        'Prefer using `{{ functionName }}.{{ preferred }}` over `{{ functionName }}.{{ actual }}`',
    },
    schema: [
      {
        type: 'object',
        properties: {
          test: {
            type: 'string',
            enum: ['each', 'for'],
          },
          it: {
            type: 'string',
            enum: ['each', 'for'],
          },
          describe: {
            type: 'string',
            enum: ['each', 'for'],
          },
          suite: {
            type: 'string',
            enum: ['each', 'for'],
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [{}],
  },
  defaultOptions: [{}],
  create(context, [options]) {
    return {
      CallExpression(node: TSESTree.CallExpression) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (!vitestFnCall) return

        const baseFunctionName = vitestFnCall.name.replace(/^[fx]/, '')

        if (!BASE_FN_NAMES.includes(baseFunctionName)) return

        const eachMember = vitestFnCall.members.find(
          (member) => getAccessorValue(member) === 'each',
        )

        const forMember = vitestFnCall.members.find(
          (member) => getAccessorValue(member) === 'for',
        )

        if (!eachMember && !forMember) return

        const preference = options[baseFunctionName as keyof Options]

        if (!preference) return

        const actual: EachOrFor = eachMember ? 'each' : 'for'

        if (actual !== preference) {
          context.report({
            node: (eachMember || forMember)!,
            messageId: 'consistentMethod',
            data: {
              functionName: vitestFnCall.name,
              preferred: preference,
              actual,
            },
          })
        }
      },
    }
  },
})
