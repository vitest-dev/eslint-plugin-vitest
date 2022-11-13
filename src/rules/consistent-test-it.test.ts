import { RuleTester } from '@typescript-eslint/utils/dist/ts-eslint'
import { describe, it } from 'vitest'
import rule, { RULE_NAME } from './consistent-test-it'

describe.skip(RULE_NAME, () => {
    const ruleTester = new RuleTester({
        parser: require.resolve('@typescript-eslint/parser')
    })

    it(`${RULE_NAME} - fn=it`, () => {
        ruleTester.run(RULE_NAME, rule, {
            valid: [
                {
                    code: `it("shows error", () => {
						expect(true).toBe(false);
					});`,
                    options: [{ fn: 'it' }]
                },
                {
                    code: `it("foo", function () {
						expect(true).toBe(false);
					})`,
                    options: [{ fn: 'it' }]
                },
                {
                    code: `	it('foo', () => {
						expect(true).toBe(false);
					});
					function myTest() { if ('bar') {} }`,
                    options: [{ fn: 'it' }]
                }
            ],
            invalid: [
                {
                    code: 'test("shows error", () => {});',
                    options: [{ fn: 'it' }],
                    output: 'test("shows error", () => {});',
                    errors: [{ messageId: 'consistentTestIt' }]
                },
                {
                    code: `
					describe('foo', () => {
						it('bar', () => {});	
						test('bar', () => {});
					});
					`,
                    output: `describe('foo', () => {
						it('bar', () => {});
						test('bar', () => {});
					});`,
                    options: [{ fn: 'it' }],
                    errors: [{ messageId: 'consistentTestIt' }]
                }
            ]
        })
    })

    it(`${RULE_NAME} - fn=test`, () => {
        ruleTester.run(RULE_NAME, rule, {
            valid: [
                {
                    code: `test("shows error", () => {
						expect(true).toBe(false);
					});`,
                    options: [{ fn: 'test' }]
                },
                {
                    code: `test("foo", function () {
						expect(true).toBe(false);
					})`,
                    options: [{ fn: 'test' }]
                },
                {
                    code: `test('foo', () => {
						expect(true).toBe(false);
					});
					function myTest() { if ('bar') {} }`,
                    options: [{ fn: 'test' }]
                }

            ],
            invalid: [
                {
                    code: 'it("shows error", () => {});',
                    output: 'it("shows error", () => {});',
                    options: [{ fn: 'test' }],
                    errors: [{ messageId: 'consistentTestIt' }]
                },
                {
                    code: `
					describe('foo', () => {
						it('bar', () => {});	
						test('bar', () => {});
					});
					`,
                    options: [{ fn: 'test' }],
                    output: `describe('foo', () => {
						it('bar', () => {});
						test('bar', () => {});
					});`,
                    errors: [{ messageId: 'consistentTestIt' }]
                }
            ]
        })
    })
})
