import { TSESTree } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'
import {
  isObjectPattern,
  isRequireVitestCall,
  isVitestGlobalsFunction,
  isVitestGlobalsImportSpecifier,
  isVitestGlobalsProperty,
  isVitestImport,
} from '../utils/guards'

const RULE_NAME = 'prefer-importing-vitest-globals'
export type MESSAGE_IDS = 'preferImportingVitestGlobals'
export type Options = []

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce importing Vitest globals',
      recommended: false,
    },
    messages: {
      preferImportingVitestGlobals: "Import '{{name}}' from 'vitest'",
    },
    schema: [],
    fixable: 'code',
  },
  create(context) {
    const importedNames = new Set<string>()
    let vitestImportSpecifiers: TSESTree.ImportClause[]
    let vitestRequireProperties:
      | TSESTree.ObjectPattern['properties']
      | undefined

    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        if (!isVitestImport(node)) return

        const specifiers = node.specifiers
        for (const specifier of specifiers) {
          if (isVitestGlobalsImportSpecifier(specifier)) {
            const importedName = specifier.imported.name
            importedNames.add(importedName)
          }
        }

        vitestImportSpecifiers = node.specifiers
      },
      VariableDeclarator(node: TSESTree.VariableDeclarator) {
        if (!isRequireVitestCall(node.init)) return
        if (!isObjectPattern(node.id)) return

        const properties = node.id.properties
        for (const prop of properties) {
          if (isVitestGlobalsProperty(prop)) {
            const importedName = prop.key.name
            importedNames.add(importedName)
          }
        }

        vitestRequireProperties = properties
      },
      CallExpression(node: TSESTree.CallExpression) {
        if (!isVitestGlobalsFunction(node)) return

        const name = node.callee.name
        if (importedNames.has(name)) return

        const scope = context.sourceCode.getScope(node)
        const variable = scope.set.get(name)

        if (variable && variable.defs.length > 0) {
          const hasTrueLocalBinding = variable.defs.some((def) => {
            if (def.type === 'ImportBinding') {
              return false
            }
            if (
              def.type === 'Variable' &&
              def.node.init &&
              isRequireVitestCall(def.node.init)
            ) {
              return false
            }
            return true
          })

          if (hasTrueLocalBinding) {
            return
          }
        }

        context.report({
          node: node.callee,
          messageId: 'preferImportingVitestGlobals',
          data: { name },
          fix(fixer) {
            const program = context.sourceCode.ast
            if (!vitestImportSpecifiers) {
              if (!vitestRequireProperties) {
                return fixer.insertTextBefore(
                  program.body[0],
                  `import { ${name} } from 'vitest';\n`,
                )
              } else {
                const lastProp =
                  vitestRequireProperties[vitestRequireProperties.length - 1]
                return fixer.insertTextAfter(lastProp, `, ${name}`)
              }
            }

            const namespaceImport = vitestImportSpecifiers.find(
              (s) => s.type === 'ImportNamespaceSpecifier',
            )
            if (namespaceImport) {
              return fixer.insertTextBefore(
                program.body[0],
                `import { ${name} } from 'vitest';\n`,
              )
            }

            const defaultImport = vitestImportSpecifiers.find(
              (s) => s.type === 'ImportDefaultSpecifier',
            )
            if (defaultImport) {
              return fixer.insertTextAfter(defaultImport, `, { ${name} }`)
            }

            const lastSpecifier =
              vitestImportSpecifiers[vitestImportSpecifiers.length - 1]
            return fixer.insertTextAfter(lastSpecifier, `, ${name}`)
          },
        })
      },
    }
  },
})
