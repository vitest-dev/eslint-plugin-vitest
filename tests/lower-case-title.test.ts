import { RuleTester } from "@typescript-eslint/utils/dist/ts-eslint"
import { it } from "vitest"
import rule, { RULE_NAME } from "../src/rules/lower-case-title"



const valids = [
    'it.each()',
    'it.each()(1)',
    'test("foo", function () {})',
    'test(`foo`, function () {})',
    `describe('foo', function () {})`,
    'describe("foo", function () {})',
]

const invalids = [
    `it('Foo', function () {})`,
    `test('Foo', function () {})`,
    `describe('Foo', function () {})`,
]

it(RULE_NAME, () => {

    const ruleTester: RuleTester = new RuleTester({
        parser: require.resolve("@typescript-eslint/parser"),
    })
    ruleTester.run(RULE_NAME, rule, {
        valid: valids,
        invalid: invalids.map(i => ({
            code: i,
            output: i,
            errors: [{ messageId: "lowerCaseTitle" }],
        })),
    })

})
