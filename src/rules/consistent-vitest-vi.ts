import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'
import { HelperName } from '../utils/types'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'

export const RULE_NAME = 'consistent-vitest-vi'
export type MESSAGE_ID = 'consistentHelper'

const getOppositeHelperKeyword = (helper: HelperName) =>
  helper === HelperName.vi ? HelperName.vitest : HelperName.vi

export default createEslintRule<[Partial<{ fn: HelperName }>], MESSAGE_ID>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: 'enforce using vitest or vi but not both',
      recommended: false
    },
    messages: {
      consistentHelper:
        'Prefer using {{ helperKeyword }} instead of {{ oppositeHelperKeyword }}'
    },
    schema: [
      {
        type: 'object',
        properties: {
          fn: {
            type: 'string',
            enum: [HelperName.vi, HelperName.vitest]
          }
        },
        additionalProperties: false
      }
    ]
  },
  defaultOptions: [{ fn: HelperName.vi }],
  create(context) {
    const config = context.options[0] ?? {}
    const helperKeyword = config.fn || HelperName.vi
    const oppositeHelperKeyword = getOppositeHelperKeyword(helperKeyword)

    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        if (
          node.source.type !== AST_NODE_TYPES.Literal
          || node.source.value !== 'vitest'
        ) {
          return
        }

        for (const specifier of node.specifiers) {
          if (specifier.type !== AST_NODE_TYPES.ImportSpecifier) {
            continue
          }
          if (specifier.imported.type !== AST_NODE_TYPES.Identifier) {
            continue
          }
          if (specifier.local.name !== specifier.imported.name) {
            continue
          }
          if (specifier.imported.name === oppositeHelperKeyword) {
            context.report({
              node: specifier,
              messageId: 'consistentHelper',
              data: {
                helperKeyword,
                oppositeHelperKeyword
              },
              fix: (fixer) => {
                const remainingSpecifiers = node.specifiers.filter(
                  spec => spec.local.name !== oppositeHelperKeyword
                )
                if (remainingSpecifiers.length > 0) {
                  const importText = remainingSpecifiers
                    .map(spec => spec.local.name)
                    .join(', ')
                  const lastSpecifierRange = node.specifiers.at(-1)?.range
                  if (!lastSpecifierRange) {
                    return null
                  }

                  return fixer.replaceTextRange(
                    [node.specifiers[0].range[0], lastSpecifierRange[1]],
                    importText
                  )
                }

                return fixer.replaceText(specifier.local, helperKeyword)
              }
            })
          }
        }
      },
      CallExpression(node: TSESTree.CallExpression) {
        const vitestFnCall = parseVitestFnCall(node, context)
        if (vitestFnCall?.type !== oppositeHelperKeyword) {
          return
        }

        const replaceNode
          = node.callee.type === AST_NODE_TYPES.MemberExpression
            ? node.callee.object
            : node.callee
        context.report({
          node: replaceNode,
          data: { helperKeyword, oppositeHelperKeyword },
          messageId: 'consistentHelper',
          fix: fixer => fixer.replaceText(replaceNode, helperKeyword)
        })
      }
    }
  }
})
