import { createEslintRule } from "../utils";

export const RULE_NAME = 'lower-case-title';
export type MessageIds = 'lowerCaseTitle';
export type Options = []

export default createEslintRule<Options, MessageIds>({
    name: RULE_NAME,
    meta: {
        type: "problem",
        docs: {
            description: "Enforce lowercase titles",
            recommended: "error",
        },
        fixable: 'code',
        schema: [],
        messages: {
            lowerCaseTitle: "Title should be lowercase.",
        },
    },
    defaultOptions: [],
    create: (context) => {

        const reserved = ["it", "describe", "test"]

        function isLowerCase(str) {
            return str == str.toLowerCase() && str != str.toUpperCase();
        }

        return {
            ExpressionStatement(node) {
                if (node.expression.type === "CallExpression" && node.expression.callee.type === "Identifier") {
                    if (reserved.includes(node.expression.callee.name)) {
                        const { arguments: args } = node.expression

                        if (args[0].type === "Literal" && typeof args[0].value === "string" && !isLowerCase(args[0].value)) {
                            context.report({
                                node,
                                messageId: 'lowerCaseTitle',
                            })
                        }
                    }
                }
            }
        }
    }
}
);
