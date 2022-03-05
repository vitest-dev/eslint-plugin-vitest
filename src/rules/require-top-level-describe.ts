import { ESLintUtils } from "@typescript-eslint/experimental-utils";

const createRule = ESLintUtils.RuleCreator(
    name => `https://github.com/veritem/vitest-eslint-plugin/blob/docs/rules/${name}.md`
)

export const rule = createRule({
    create(context) {
        return {
            FunctionDeclaration(node) {
                if (/^[a-z]/.test(node.id.name)) {
                    context.report({
                        messageId: 'uppercase',
                        node: node.id,
                    });
                }
            },
        };
    },
    meta: {
        docs: {
            description: `Disallow lowercase test case name`,
            recommended: false,
            //@ts-ignore
            url: "https://github.com/veritem/vitest-eslint-plugin/blob/docs/rules/no-lowercase-test-case-name.md",
            suggestion: false,
            requiresTypeChecking: false,
            extendsBaseRule: true,
        },
        type: "suggestion",
        messages: {
            lowercase: "Use lowercase for function name.",
            uppercase: "Use uppercase for function name.",
        },
        schema: [],
    },
})


export default rule;
