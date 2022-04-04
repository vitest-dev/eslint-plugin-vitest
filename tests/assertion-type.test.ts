import { RuleTester } from "@typescript-eslint/utils/dist/ts-eslint"
import { it } from "vitest"
import { RULE_NAME } from "../src/rules/assertion-type"


const valid = [`it.each()`]
const invalids = []


it(RULE_NAME, () => {
    const rule_tester: RuleTester = new RuleTester({
        parser: require.resolve("@typescript-eslint/parser")
    })

    // rule_tester.run(RULE_NAME, rule, {
    //     valid,
    //     invalid: invalids.map(i => ({
    //         code: i,
    //         output: i,
    //         errors: [{ messageId: "lowerCaseTitle" }],
    //     })),
    // })
})
