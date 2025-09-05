import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'

export const RULE_NAME = 'hoisted-apis-on-top'

type MESSAGE_ID =
  | 'hoistedApisOnTop'
  | 'suggestMoveHoistedApiToTop'
  | 'suggestReplaceMockWithDoMock'

const hoistedAPIs = ['mock', 'hoisted', 'unmock']

export default createEslintRule<[], MESSAGE_ID>({
  name: RULE_NAME,
  meta: {
    hasSuggestions: true,
    type: 'suggestion',
    docs: {
      description: 'enforce hoisted APIs to be on top of the file',
    },
    messages: {
      hoistedApisOnTop: `Hoisted API is used in a runtime location in this file, but it is actually executed before this file is loaded.`,
      suggestMoveHoistedApiToTop:
        'Move this hoisted API to the top of the file to better reflect its behavior.',
      suggestReplaceMockWithDoMock:
        "Replace 'vi.mock()' with 'vi.doMock()', which is not hoisted.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    let lastImportEnd: null | number = null
    const nodesToReport: Array<TSESTree.CallExpression> = []

    return {
      // for suggestion fixer
      ImportDeclaration(node) {
        if (node.parent.type !== AST_NODE_TYPES.Program) {
          // This shouldn't happen in a valid AST anyway, but we never want to
          // suggest moving an API to a non-top-level position, so ignore.
          return
        }
        lastImportEnd = node.range[1]
      },

      CallExpression(node) {
        // Only consider vi.<api> member calls
        if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return

        const { object, property } = node.callee
        if (
          object.type !== AST_NODE_TYPES.Identifier ||
          object.name !== 'vi' ||
          property.type !== AST_NODE_TYPES.Identifier
        ) {
          return
        }

        const apiName = property.name
        if (!hoistedAPIs.includes(apiName)) return
        // Determine whether this usage is in an allowed top-level position.
        if (apiName === 'hoisted') {
          // For hoisted: allow top-level ExpressionStatement or VariableDeclaration,
          // and allow wrapping by await and variable declarator.
          let parent = node.parent
          if (parent && parent.type === AST_NODE_TYPES.AwaitExpression)
            parent = parent.parent
          if (parent && parent.type === AST_NODE_TYPES.VariableDeclarator)
            parent = parent.parent

          if (
            (parent.type === AST_NODE_TYPES.ExpressionStatement ||
              parent.type === AST_NODE_TYPES.VariableDeclaration) &&
            parent.parent.type === AST_NODE_TYPES.Program
          ) {
            return
          }
        } else {
          // For mock/unmock: only a bare top-level ExpressionStatement is allowed.
          if (
            node.parent.type === AST_NODE_TYPES.ExpressionStatement &&
            node.parent.parent.type === AST_NODE_TYPES.Program
          ) {
            return
          }
        }

        nodesToReport.push(node)
      },

      'Program:exit'() {
        for (const node of nodesToReport) {
          const suggestions: TSESLint.SuggestionReportDescriptor<MESSAGE_ID>[] =
            []

          suggestions.push({
            messageId: 'suggestMoveHoistedApiToTop',
            *fix(fixer) {
              if (node.parent.type === AST_NODE_TYPES.ExpressionStatement) {
                yield fixer.remove(node)
              } else {
                yield fixer.replaceText(node, 'undefined')
              }

              if (lastImportEnd != null) {
                yield fixer.insertTextAfterRange(
                  [lastImportEnd, lastImportEnd],
                  '\n' + context.sourceCode.getText(node) + ';',
                )
              } else {
                yield fixer.insertTextAfterRange(
                  [0, 0],
                  context.sourceCode.getText(node) + ';\n',
                )
              }
            },
          })

          const property = (node.callee as TSESTree.MemberExpression)
            .property as TSESTree.Identifier
          if (property.name === 'mock')
            suggestions.push({
              messageId: 'suggestReplaceMockWithDoMock',
              fix(fixer) {
                return fixer.replaceText(property, 'doMock')
              },
            })

          context.report({
            node,
            messageId: 'hoistedApisOnTop',
            suggest: suggestions,
          })
        }
      },
    }
  },
})
