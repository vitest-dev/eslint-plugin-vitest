import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils';
import { createEslintRule } from '../utils';
import { UtilName } from '../utils/types';
import { parseVitestFnCall } from '../utils/parse-vitest-fn-call';

export const RULE_NAME = 'consistent-vitest-vi';
export type MESSAGE_ID = 'consistentUtil';

const getOppositeVitestUtilKeyword = (util: UtilName) =>
  util === UtilName.vi ? UtilName.vitest : UtilName.vi;

export default createEslintRule<[Partial<{ fn: UtilName }>], MESSAGE_ID>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: 'enforce using vitest or vi but not both',
      recommended: false,
    },
    messages: {
      consistentUtil:
        'Prefer using {{ utilKeyword }} instead of {{ oppositeUtilKeyword }}',
    },
    schema: [
      {
        type: 'object',
        properties: {
          fn: {
            type: 'string',
            enum: [UtilName.vi, UtilName.vitest],
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{ fn: UtilName.vi }],
  create(context) {
    const config = context.options[0] ?? {};
    const utilKeyword = config.fn || UtilName.vi;
    const oppositeUtilKeyword = getOppositeVitestUtilKeyword(utilKeyword);

    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        if (
          node.source.type !== AST_NODE_TYPES.Literal ||
          node.source.value !== 'vitest'
        ) {
          return;
        }

        for (const specifier of node.specifiers) {
          if (specifier.type !== AST_NODE_TYPES.ImportSpecifier) {
            continue;
          }
          if (specifier.imported.type !== AST_NODE_TYPES.Identifier) {
            continue;
          }
          if (specifier.local.name !== specifier.imported.name) {
            continue;
          }
          if (specifier.imported.name === oppositeUtilKeyword) {
            context.report({
              node: specifier,
              messageId: 'consistentUtil',
              data: {
                utilKeyword,
                oppositeUtilKeyword,
              },
              fix: (fixer) => {
                const remainingSpecifiers = node.specifiers.filter(
                  (spec) => spec.local.name !== oppositeUtilKeyword
                );
                if (remainingSpecifiers.length > 0) {
                  const importText = remainingSpecifiers
                    .map((spec) => spec.local.name)
                    .join(', ');
                  const lastSpecifierRange = node.specifiers.at(-1)?.range;
                  if (!lastSpecifierRange) {
                    return null;
                  }

                  return fixer.replaceTextRange(
                    [node.specifiers[0].range[0], lastSpecifierRange[1]],
                    importText
                  );
                }

                return fixer.replaceText(specifier.local, utilKeyword);
              },
            });
          }
        }
      },
      CallExpression(node: TSESTree.CallExpression) {
        const vitestFnCall = parseVitestFnCall(node, context);
        if (vitestFnCall?.type !== oppositeUtilKeyword) {
          return;
        }

        const replaceNode =
          node.callee.type === AST_NODE_TYPES.MemberExpression
            ? node.callee.object
            : node.callee;
        context.report({
          node: replaceNode,
          data: { utilKeyword, oppositeUtilKeyword },
          messageId: 'consistentUtil',
          fix: (fixer) => fixer.replaceText(replaceNode, utilKeyword),
        });
      },
    };
  },
});
