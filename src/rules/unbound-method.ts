import { createRequire } from 'node:module'
import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getAccessorValue, isIdentifier } from '../utils'
import {
  findTopMostCallExpression,
  parseVitestFnCall,
} from '../utils/parse-vitest-fn-call'

const require = createRequire(import.meta.url)

const RULE_NAME = 'unbound-method'

const toThrowMatchers = [
  'toThrow',
  'toThrowError',
  'toThrowErrorMatchingSnapshot',
  'toThrowErrorMatchingInlineSnapshot',
]

export type MESSAGE_IDS = 'unbound' | 'unboundWithoutThisAnnotation'

const DEFAULT_MESSAGE = 'This rule requires `@typescript-eslint/eslint-plugin`'

interface Config {
  ignoreStatic: boolean
}

export type Options = [Config]

const baseRule = (() => {
  try {
    const TSESLintPlugin = require('@typescript-eslint/eslint-plugin')

    return TSESLintPlugin.rules['unbound-method'] as TSESLint.RuleModule<
      MESSAGE_IDS,
      Options
    >
  } catch (error: unknown) {
    const errorCode =
      typeof error === 'object' && error !== null && 'code' in error
        ? error.code
        : undefined

    if (errorCode === 'MODULE_NOT_FOUND' || errorCode === 'ERR_REQUIRE_ESM') {
      return null
    }

    throw error
  }
})()

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    messages: {
      unbound: DEFAULT_MESSAGE,
      unboundWithoutThisAnnotation: DEFAULT_MESSAGE,
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignoreStatic: {
            description: 'Ignore unbound warnings for static methods.',
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
    type: 'problem',
    ...baseRule?.meta,
    docs: {
      ...baseRule?.meta.docs,
      description:
        'enforce unbound methods are called with their expected scope',
      recommended: false,
      requiresTypeChecking: true,
    },
    defaultOptions: [{ ignoreStatic: false }],
  },
  create(context) {
    const baseSelectors = baseRule?.create(context)

    if (!baseSelectors) return {}

    return {
      ...baseSelectors,
      MemberExpression(node: TSESTree.MemberExpression) {
        if (node.parent?.type === AST_NODE_TYPES.CallExpression) {
          const vitestFnCall = parseVitestFnCall(
            findTopMostCallExpression(node.parent),
            context,
          )

          if (
            vitestFnCall?.type === 'vi' &&
            vitestFnCall.members.length >= 1 &&
            isIdentifier(vitestFnCall.members[0], 'mocked')
          )
            return

          if (vitestFnCall?.type === 'expect') {
            const { matcher } = vitestFnCall

            if (!toThrowMatchers.includes(getAccessorValue(matcher))) return
          }
        }
        baseSelectors?.MemberExpression?.(node)
      },
    }
  },
})
