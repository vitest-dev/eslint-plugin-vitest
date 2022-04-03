import { RuleTester } from "@typescript-eslint/utils/dist/ts-eslint"
import { it } from "vitest"
import rule, { RULE_NAME } from "./no-conditional-in-tests"

const invalids = [
    `describe('my tests', () => {
  if (true) {
    it('foo', () => {
      doTheThing();
    });
  }
});`,
    `beforeEach(() => {
  switch (type) {
    case 'none':
      console.log('none')
    case 'single':
    console.log('single')
    case 'multiple':
     console.log('multiple')
}
});`
]

const valids = [
    `it('test', () => {
    assert.equal(Math.sqrt(4), 2)
  })`,
    `describe.skip('skipped suite', () => {
  it('test', () => {
    assert.equal(Math.sqrt(4), 3)
  })
})`
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
            errors: [{ messageId: "noConditionalInTests" }],
        })),
    })
})
