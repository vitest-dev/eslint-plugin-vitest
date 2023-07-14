import { RuleTester } from '@typescript-eslint/rule-tester'
import { afterAll, describe, it } from 'vitest'

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it

export const ruleTester: RuleTester = new RuleTester({
    parser: '@typescript-eslint/parser'
})
