import { describe, test } from 'vitest'
import ruleTester from '../utils/tester'
import rule, { RULE_NAME } from './prefer-comparison-matcher'

describe(RULE_NAME, () => {
	test(RULE_NAME, () => {
		ruleTester.run(RULE_NAME, rule, {
			valid: [
				'expect.hasAssertions',
				'expect.hasAssertions()',
				'expect.assertions(1)',
				'expect(true).toBe(...true)',
				'expect()',
				'expect({}).toStrictEqual({})',
				'expect(a === b).toBe(true)',
				'expect(a !== 2).toStrictEqual(true)',
				'expect(a === b).not.toEqual(true)',
				'expect(a !== "string").toStrictEqual(true)',
				'expect(5 != a).toBe(true)',
				'expect(a == "string").toBe(true)',
				'expect(a == "string").not.toBe(true)',
				'expect().fail(\'Should not succeed a HTTPS proxy request.\');'
			],
			invalid: [
				{
					code: 'expect(a > b).toBe(true)',
					output: 'expect(a).toBeGreaterThan(b)',
					errors: [
						{
							messageId: 'useToBeComparison',
							data: {
								preferredMatcher: 'toBeGreaterThan'
							}
						}
					]
				},
				{
					code: 'expect(a < b).toBe(true)',
					output: 'expect(a).toBeLessThan(b)',
					errors: [
						{
							messageId: 'useToBeComparison',
							data: {
								preferredMatcher: 'toBeLessThan'
							}
						}
					]
				},
				{
					code: 'expect(a >= b).toBe(true)',
					output: 'expect(a).toBeGreaterThanOrEqual(b)',
					errors: [
						{
							messageId: 'useToBeComparison',
							data: {
								preferredMatcher: 'toBeGreaterThanOrEqual'
							}
						}
					]
				},
				{
					code: 'expect(a <= b).toBe(true)',
					output: 'expect(a).toBeLessThanOrEqual(b)',
					errors: [
						{
							messageId: 'useToBeComparison'
						}
					]
				},
				{
					code: 'expect(a > b).not.toBe(true)',
					output: 'expect(a).toBeLessThanOrEqual(b)',
					errors: [
						{
							messageId: 'useToBeComparison'
						}
					]
				},
				{
					code: 'expect(a < b).not.toBe(true)',
					output: 'expect(a).toBeGreaterThanOrEqual(b)',
					errors: [
						{
							messageId: 'useToBeComparison'
						}
					]
				},
				{
					code: 'expect(a >= b).not.toBe(true)',
					output: 'expect(a).toBeLessThan(b)',
					errors: [
						{
							messageId: 'useToBeComparison'
						}
					]
				}
			]
		})
	})
})
