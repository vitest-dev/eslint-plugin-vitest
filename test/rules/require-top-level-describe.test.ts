import { ESLintUtils } from "@typescript-eslint/utils";
import { describe, it } from "vitest";
import rule from "../../src/rules/require-top-level-describe";



describe("Rule 1", () => {
    it("It should pass", () => {
        const ruleTester = new ESLintUtils.RuleTester({
            parser: '@typescript-eslint/parser',
        });

        ruleTester.run("require-top-level-describe", rule, {
            valid: [],
            invalid: [],
        })

    })
})
