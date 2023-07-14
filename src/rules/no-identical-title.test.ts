import { ruleTester } from '../utils/test'
import rule, { RULE_NAME } from './no-identical-title'
import {describe, it} from "vitest"

describe(RULE_NAME, () => {
	it('no identical title', () => {
		ruleTester.run(RULE_NAME, rule, {
		  valid: ['it(); it();', 'test("two", () => {});'],
		  invalid: [
			{
			  code: `describe('foo', () => {
						  it('works', () => {});
						  it('works', () => {});
						});`,
			  errors: [{ messageId: 'multipleTestTitle' }]
			},
			{
			  code: `xdescribe('foo', () => {
						  it('works', () => {});
						  it('works', () => {});
					  });`,
			  errors: [{ messageId: 'multipleTestTitle' }]
			}
		  ]
		})
	  })
})

