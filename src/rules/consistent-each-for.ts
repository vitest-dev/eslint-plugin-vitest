import { TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getAccessorValue } from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'

export const RULE_NAME = 'consistent-each-for'
export type MessageIds = 'consistentMethod'
export type EachOrFor = 'each' | 'for'
export type BaseFnName = 'test' | 'it' | 'describe' | 'suite'

const BASE_FN_NAMES: readonly BaseFnName[] = [
  'test',
  'it',
  'describe',
  'suite',
] as const

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
  },
  defaultOptions: [{}],
  create(context, [options]) {
    return {
      CallExpression(node: TSESTree.CallExpression) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (!vitestFnCall) return

        // Determine the base function name (test, it, describe, or suite)
        const baseFunctionName = vitestFnCall.name.replace(
          /^[fx]/,
          '',
        ) as BaseFnName

        // Only check test, it, describe, and suite functions
        if (!BASE_FN_NAMES.includes(baseFunctionName)) return

        // Check if the call chain contains .each or .for
        const eachMember = vitestFnCall.members.find(
          (member) => getAccessorValue(member) === 'each',
        )
        const forMember = vitestFnCall.members.find(
          (member) => getAccessorValue(member) === 'for',
        )

        // If neither .each nor .for is used, nothing to check
        if (!eachMember && !forMember) return

        const preference = options[baseFunctionName as keyof Options]

        // If no preference is configured for this function, skip
        if (!preference) return

        const actual: EachOrFor = eachMember ? 'each' : 'for'

        // Report if actual usage doesn't match preference
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
