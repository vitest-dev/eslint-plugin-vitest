import { describe, it } from 'vitest'
import rule, { RULE_NAME } from '../src/rules/consistent-test-filename'
import { ruleTester } from './ruleTester'

describe(RULE_NAME, () => {
	it(`${RULE_NAME}`, () => {
		ruleTester.run(RULE_NAME, rule, {
			valid: [
				{
					code: 'export {}',
					filename: '1.test.ts',
					options: [{ pattern: String.raw`.*\.test\.ts$` }]
				}
			],
			invalid: [
				{
					code: 'export {}',
					filename: '1.spec.ts',
					errors: [{ messageId: 'msg' }],
					options: [{ pattern: String.raw`.*\.test\.ts$` }]
				}
			]
		})
	})
})
