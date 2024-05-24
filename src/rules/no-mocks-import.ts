import { posix } from 'node:path'
import { TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getStringValue, isStringNode } from '../utils'

const mocksDirName = '__mocks__'

const isMockPath = (path: string) => path.split(posix.sep).includes(mocksDirName)

const isMockImportLiteral = (expression: TSESTree.CallExpressionArgument) => isStringNode(expression) && isMockPath(getStringValue(expression))

export const RULE_NAME = 'no-mocks-import'
type MESSAGE_IDS = 'noMocksImport'
type Options = []

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow importing from __mocks__ directory',
      recommended: 'strict'
    },
    messages: {
      noMocksImport: `Mocks should not be manually imported from a ${mocksDirName} directory. Instead use \`jest.mock\` and import from the original module path.`
    },
    schema: []
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        if (isMockImportLiteral(node.source))
          context.report({ node, messageId: 'noMocksImport' })
      },
      'CallExpression[callee.name="require"]'(node: TSESTree.CallExpression) {
        const [args] = node.arguments

        if (args && isMockImportLiteral(args))
          context.report({ node: args, messageId: 'noMocksImport' })
      }
    }
  }
})
