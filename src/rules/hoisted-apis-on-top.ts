import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'

const RULE_NAME = 'hoisted-apis-on-top'

type MESSAGE_ID =
  | 'hoistedApisOnTop'
  | 'suggestMoveHoistedApiToTop'
  | 'suggestReplaceMockWithDoMock'

const hoistedAPIs = ['mock', 'hoisted', 'unmock']
const vitestNamespaceNames = new Set(['vi', 'vitest'])

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
  create(context) {
    let lastImportEnd: null | number = null
    const nodesToReport: Array<TSESTree.CallExpression> = []
    const namespaceLocalNames = new Set<string>(vitestNamespaceNames)

    return {
      ImportDeclaration(node) {
        lastImportEnd = node.range[1]

        if (
          node.source.type !== AST_NODE_TYPES.Literal ||
          node.source.value !== 'vitest'
        ) {
          for (const spec of node.specifiers) {
            if (
              spec.type === AST_NODE_TYPES.ImportSpecifier &&
              spec.local.type === AST_NODE_TYPES.Identifier &&
              vitestNamespaceNames.has(spec.local.name)
            ) {
              namespaceLocalNames.delete(spec.local.name)
            }
          }
          return
        }

        for (const spec of node.specifiers) {
          if (
            spec.type === AST_NODE_TYPES.ImportSpecifier &&
            spec.imported.type === AST_NODE_TYPES.Identifier &&
            vitestNamespaceNames.has(spec.imported.name) &&
            spec.local.type === AST_NODE_TYPES.Identifier
          ) {
            namespaceLocalNames.add(spec.local.name)
          }
        }
      },

      CallExpression(node) {
        // Only consider <vitest namespace>.<api> member calls
        if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return

        const { object, property } = node.callee
        if (
          object.type !== AST_NODE_TYPES.Identifier ||
          !namespaceLocalNames.has(object.name) ||
          property.type !== AST_NODE_TYPES.Identifier
        ) {
          return
        }

        const apiName = property.name
        if (!hoistedAPIs.includes(apiName)) return
        if (apiName === 'hoisted') {
          let parent: TSESTree.Node | undefined = node.parent
          if (parent?.type === AST_NODE_TYPES.AwaitExpression)
            parent = parent.parent
          if (parent?.type === AST_NODE_TYPES.VariableDeclarator)
            parent = parent.parent

          if (
            (parent?.type === AST_NODE_TYPES.ExpressionStatement ||
              parent?.type === AST_NODE_TYPES.VariableDeclaration) &&
            parent.parent?.type === AST_NODE_TYPES.Program
          ) {
            return
          }
        } else {
          if (
            node.parent?.type === AST_NODE_TYPES.ExpressionStatement &&
            node.parent.parent?.type === AST_NODE_TYPES.Program
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
