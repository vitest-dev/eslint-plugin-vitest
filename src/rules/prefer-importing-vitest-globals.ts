import { TSESTree } from "@typescript-eslint/utils";
import { createEslintRule } from "../utils";
import { VITEST_GLOBALS } from "src/utils/valid-vitest-globals";

export const RULE_NAME = 'prefer-importing-vitest-globals';
export type MESSAGE_IDS = 'preferImportingVitestGlobals';
export type Options = [];

export default createEslintRule<Options, MESSAGE_IDS>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Detect usage of Vitest globals without importing them',
      recommended: false,
    },
    messages: {
      preferImportingVitestGlobals:
        "Import '{{name}}' from 'vitest'",
    },
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node: TSESTree.CallExpression) {
        if (
          node.callee.type !== TSESTree.AST_NODE_TYPES.Identifier ||
          !VITEST_GLOBALS.has(node.callee.name)
        ) {
          return;
        }

        context.report({
          node: node.callee,
          messageId: 'preferImportingVitestGlobals',
          data: { name: 'TODO' },
        });
      },
    };
  },
});
