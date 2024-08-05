import { TSESTree } from '@typescript-eslint/utils'
import { createEslintRule } from '../utils'
import { parseVitestFnCall, VitestFnType } from '../utils/parse-vitest-fn-call'

export const RULE_NAME = 'prefer-each'
export type MESSAGE_IDS = 'preferEach'

export default createEslintRule({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce using `each` rather than manual loops',
      recommended: false
    },
    schema: [],
    messages: {
      preferEach: 'Prefer using `{{ fn }}.each` rather than a manual loop'
    }
  },
  defaultOptions: [],
  create(context) {
    const vitestFnCalls: VitestFnType[] = []
    let inTestCaseCall = false

    const recommendFn = () => {
      if (vitestFnCalls.length === 1 && vitestFnCalls[0] === 'test')
        return 'it'

      return 'describe'
    }

    const enterForLoop = () => {
      if (vitestFnCalls.length === 0 || inTestCaseCall) return

      vitestFnCalls.length = 0
    }

    const exitForLoop = (
      node:
        | TSESTree.ForInStatement
        | TSESTree.ForOfStatement
        | TSESTree.ForStatement
    ) => {
      if (vitestFnCalls.length === 0 || inTestCaseCall) return

      context.report({
        node,
        messageId: 'preferEach',
        data: { fn: recommendFn() }
      })
      vitestFnCalls.length = 0
    }

    return {
      'ForStatement': enterForLoop,
      'ForStatement:exit': exitForLoop,
      'ForInStatement': enterForLoop,
      'ForInStatement:exit': exitForLoop,
      'ForOfStatement': enterForLoop,
      'ForOfStatement:exit': exitForLoop,
      CallExpression(node) {
        const { type: vitestFnCallType } = parseVitestFnCall(node, context) ?? {}

        if (vitestFnCallType === 'hook'
          || vitestFnCallType === 'describe'
          || vitestFnCallType === 'test')
          vitestFnCalls.push(vitestFnCallType)

        if (vitestFnCallType === 'test')
          inTestCaseCall = true
      },
      'CallExpression:exit'(node) {
        const { type: vitestFnCallType } = parseVitestFnCall(node, context) ?? {}
        if (vitestFnCallType === 'test')
          inTestCaseCall = false
      }
    }
  }
})
