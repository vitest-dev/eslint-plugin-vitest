import { isAbsolute } from 'node:path'
import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils'
import {
  createEslintRule,
  getAccessorValue,
  isSupportedAccessor,
} from '../utils'
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call'

const RULE_NAME = 'no-large-snapshots'

type MESSAGE_IDS = 'noSnapShot' | 'tooLongSnapShot'

type RuleOptions = {
  maxSize?: number
  inlineMaxSize?: number
  allowedSnapshots?: Record<string, Array<string | RegExp>>
}

const reportOnViolation = (
  context: TSESLint.RuleContext<MESSAGE_IDS, [RuleOptions]>,
  node: TSESTree.CallExpressionArgument | TSESTree.ExpressionStatement,
  { maxSize: lineLimit = 50, allowedSnapshots = {} }: RuleOptions,
) => {
  const startLine = node.loc.start.line
  const endLine = node.loc.end.line
  const lineCount = endLine - startLine

  const allPathsAreAbsolute = Object.keys(allowedSnapshots).every(isAbsolute)

  if (!allPathsAreAbsolute)
    throw new Error(
      'All paths for allowedSnapshots must be absolute. You can use JS config and `path.resolve`',
    )

  let isAllowed = false

  if (
    node.type === AST_NODE_TYPES.ExpressionStatement &&
    'left' in node.expression &&
    node.expression.left.type === AST_NODE_TYPES.MemberExpression &&
    isSupportedAccessor(node.expression.left.property)
  ) {
    const fileName = context.filename
    const allowedSnapshotsInFile = allowedSnapshots[fileName]

    if (allowedSnapshotsInFile) {
      const snapshotName = getAccessorValue(node.expression.left.property)

      isAllowed = allowedSnapshotsInFile.some((name) => {
        if (name instanceof RegExp) return name.test(snapshotName)

        return snapshotName === name
      })
    }
  }

  if (!isAllowed && lineCount > lineLimit) {
    context.report({
      node,
      messageId: lineLimit === 0 ? 'noSnapShot' : 'tooLongSnapShot',
      data: {
        lineCount,
        lineLimit,
      },
    })
  }
}

export default createEslintRule<[RuleOptions], MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'disallow large snapshots',
      recommended: false,
    },
    messages: {
      noSnapShot: '`{{ lineCount }}`s should begin with lowercase',
      tooLongSnapShot:
        'Expected vitest snapshot to be smaller than {{ lineLimit }} lines but was {{ lineCount }} lines long',
    },
    type: 'suggestion',
    schema: [
      {
        type: 'object',
        properties: {
          maxSize: {
            type: 'number',
          },
          inlineMaxSize: {
            type: 'number',
          },
          allowedSnapshots: {
            type: 'object',
            additionalProperties: { type: 'array' },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{}],
  create(context, [options]) {
    if (context.filename.endsWith('.snap')) {
      return {
        ExpressionStatement(node) {
          reportOnViolation(context, node, options)
        },
      }
    }

    return {
      CallExpression(node) {
        const vitestFnCall = parseVitestFnCall(node, context)

        if (vitestFnCall?.type !== 'expect') return

        if (
          [
            'toMatchInlineSnapshot',
            'toThrowErrorMatchingInlineSnapshot',
          ].includes(getAccessorValue(vitestFnCall.matcher)) &&
          vitestFnCall.args.length
        ) {
          reportOnViolation(context, vitestFnCall.args[0], {
            ...options,
            maxSize: options.inlineMaxSize ?? options.maxSize,
          })
        }
      },
    }
  },
})
