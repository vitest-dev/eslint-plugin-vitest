import { TSESLint, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'
import { isObjectPattern, isRequireVitestCall, isVitestGlobalsImportSpecifier, isVitestGlobalsProperty, isVitestImport } from '../utils/guards'
import { removeNodeFromArray, removeVariableDeclarator } from '../utils/fixer-utils'

export const RULE_NAME = 'no-importing-vitest-globals'
export type MESSAGE_IDS = 'noImportingVitestGlobals' | 'noRequiringVitestGlobals'
export type Options = []

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow importing Vitest globals',
      recommended: false
    },
    messages: {
      noImportingVitestGlobals: 'Do not import \'{{name}}\' from \'vitest\'. Use globals configuration instead.',
      noRequiringVitestGlobals: 'Do not require \'{{name}}\' from \'vitest\'. Use globals configuration instead.'
    },
    fixable: 'code',
    schema: []
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        if (!isVitestImport(node)) return

        const specifiers = node.specifiers
        for (const specifier of specifiers) {
          if (!isVitestGlobalsImportSpecifier(specifier)) {
            continue
          }

          context.report({
            node: specifier,
            messageId: 'noImportingVitestGlobals',
            data: {
              name: specifier.imported.name
            },
            fix(fixer: TSESLint.RuleFixer) {
              const allDisallowed = specifiers.every(spec => isVitestGlobalsImportSpecifier(spec))
              if (allDisallowed) {
                return fixer.remove(node)
              }

              return removeNodeFromArray(fixer, specifiers, specifier)
            }
          })
        }
      },
      VariableDeclarator(node: TSESTree.VariableDeclarator) {
        if (!isRequireVitestCall(node.init)) return
        if (!isObjectPattern(node.id)) return

        const properties = node.id.properties
        for (const prop of properties) {
          if (!isVitestGlobalsProperty(prop)) {
            continue
          }

          context.report({
            node: prop,
            messageId: 'noRequiringVitestGlobals',
            data: {
              name: prop.key.name
            },
            fix(fixer) {
              const allDisallowed = properties.every(p => isVitestGlobalsProperty(p))
              if (allDisallowed) {
                return removeVariableDeclarator(fixer, node)
              }

              return removeNodeFromArray(fixer, properties, prop)
            }
          })
        }
      }
    }
  }
})
