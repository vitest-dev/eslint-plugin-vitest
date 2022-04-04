import { createEslintRule } from "../utils";

export const RULE_NAME = 'assertion-type';
export type MessageIds = 'assertionType';
export type Options = [
    {
        type: "jest" | "chai",
    }
];
export default createEslintRule<Options, MessageIds>({
    name: RULE_NAME,
    meta: {
        type: "problem",
        docs: {
            description: "Enforce assertion type",
            recommended: "error",
        },
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        enum: ['jest', 'chai'],
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            assertionType: "Assertion type should be {{type}}.",
        },
    },
    defaultOptions: [
        {
            type: "jest",
        },
    ],
    create(context) {
        const { type } = context.options[0];
        const assertionType = type === "jest" ? "expect" : "assert";
        return {
            ExpressionStatement(node) {
                if (node.expression.type === "CallExpression" && node.expression.callee.type === "Identifier") {
                    if (node.expression.callee.name === assertionType) {
                        const { arguments: args } = node.expression
                        if (args[0].type === "Identifier" && args[0].name !== "t") {
                            context.report({
                                node,
                                messageId: 'assertionType',
                                data: {
                                    type,
                                },
                            })
                        }
                    }
                }
            }
        }
    }
});
