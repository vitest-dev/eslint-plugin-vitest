import { TSESTree, TSESLint } from '@typescript-eslint/utils'
import { createEslintRule, getStringValue, isStringNode, StringNode } from '../utils'
import { isTypeOfVitestFnCall, parseVitestFnCall } from '../utils/parse-vitest-fn-call'
import { CallExpressionWithSingleArgument, DescribeAlias, TestCaseName } from '../utils/types'

export const RULE_NAME = 'prefer-lowercase-title'
export type MessageIds = 'lowerCaseTitle'

type IgnorableFunctionExpressions =
  | TestCaseName.it
  | TestCaseName.test
  | TestCaseName.bench
  | DescribeAlias.describe

const hasStringAsFirstArgument = (
  node: TSESTree.CallExpression
): node is CallExpressionWithSingleArgument<StringNode> =>
  node.arguments[0] && isStringNode(node.arguments[0])

const populateIgnores = (ignore: readonly string[]): string[] => {
  const ignores: string[] = []

  if (ignore.includes(DescribeAlias.describe))
    ignores.push(...Object.keys(DescribeAlias))

  if (ignore.includes(TestCaseName.test)) {
    ignores.push(
      ...Object.keys(TestCaseName).filter(k => k.endsWith(TestCaseName.test))
    )
  }
  if (ignore.includes(TestCaseName.it)) {
    ignores.push(
      ...Object.keys(TestCaseName).filter(k => k.endsWith(TestCaseName.it))
    )
  }

  return ignores
}

export default createEslintRule<[
  Partial<{
    ignore: string[]
    allowedPrefixes: string[]
    ignoreTopLevelDescribe: boolean
    lowercaseFirstCharacterOnly: boolean
  }>
], MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce lowercase titles',
      recommended: false
    },
    fixable: 'code',
    messages: {
      lowerCaseTitle: '`{{ method }}`s should begin with lowercase',
      fullyLowerCaseTitle: '`{{ method }}`s should be lowercase'
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignore: {
            type: 'array',
            items: {
              type: "string",
              enum: [
                DescribeAlias.describe,
                TestCaseName.test,
                TestCaseName.it
              ]
            }
          },
          allowedPrefixes: {
            type: 'array',
            items: { type: 'string' },
            additionalItems: false
          },
          ignoreTopLevelDescribe: {
            type: 'boolean',
            default: false
          },
          lowercaseFirstCharacterOnly: {
            type: 'boolean',
            default: true
          }
        },
        additionalProperties: false
      }
    ]
  },
  defaultOptions: [
    { ignore: [], allowedPrefixes: [], ignoreTopLevelDescribe: false, lowercaseFirstCharacterOnly: true }
  ],
  create: (context, [{ ignore = [], allowedPrefixes = [], ignoreTopLevelDescribe = false, lowercaseFirstCharacterOnly = false }]) => {
    const ignores = populateIgnores(ignore)
    let numberOfDescribeBlocks = 0

    return {
      CallExpression(node: TSESTree.CallExpression) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (!vitestFnCall || !hasStringAsFirstArgument) return

        if (vitestFnCall?.type === 'describe') {
          numberOfDescribeBlocks++

          if (ignoreTopLevelDescribe && numberOfDescribeBlocks === 1)
            return
        }
        else if (vitestFnCall?.type !== 'test') {
          return
        }

        const [firstArgument] = node.arguments

        // @ts-expect-error
        const description = getStringValue(firstArgument)

        if (typeof description !== 'string') return

        if (allowedPrefixes.some(prefix => description.startsWith(prefix))) return

        const firstCharacter = description.charAt(0)

        if (
          ignores.includes(vitestFnCall.name as IgnorableFunctionExpressions)
          || (lowercaseFirstCharacterOnly && (!firstCharacter || firstCharacter === firstCharacter.toLowerCase()))
          || (!lowercaseFirstCharacterOnly && description === description.toLowerCase())
        ) return

        context.report({
          messageId: lowercaseFirstCharacterOnly ? 'lowerCaseTitle' : 'fullyLowerCaseTitle',
          node: node.arguments[0],
          data: {
            method: vitestFnCall.name
          },
          fix: (fixer) => {
            // @ts-expect-error
            const description = getStringValue(firstArgument)

            const rangeIgnoreQuotes: TSESLint.AST.Range = [
              firstArgument.range[0] + 1,
              firstArgument.range[1] - 1
            ]

            const newDescription = lowercaseFirstCharacterOnly
              ? description.substring(0, 1).toLowerCase() + description.substring(1)
              : description.toLowerCase()

            return [fixer.replaceTextRange(rangeIgnoreQuotes, newDescription)]
          }
        })
      },
      'CallExpression:exit'(node: TSESTree.CallExpression) {
        if (isTypeOfVitestFnCall(node, context, ['describe']))
          numberOfDescribeBlocks--
      }
    }
  }
})
