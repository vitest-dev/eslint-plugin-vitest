import { RuleTester } from '@typescript-eslint/utils/dist/ts-eslint'
import { describe, test } from 'vitest'
import rule, { RULE_NAME } from './valid-expect'

const ruleTester: RuleTester = new RuleTester({
	parser: require.resolve('@typescript-eslint/parser')
})

describe(RULE_NAME, () => {
	test(RULE_NAME + ' in promise', () => {
		ruleTester.run(RULE_NAME, rule, {
			valid: [
				'test(\'something\', () => Promise.resolve().then(() => expect(1).toBe(2)));',
				'Promise.resolve().then(() => expect(1).toBe(2))',
				'const x = Promise.resolve().then(() => expect(1).toBe(2))',
				`it('is valid', () => {
					const promise = loadNumber().then(number => {
					  expect(typeof number).toBe('number');
			
					  return number + 1;
					});
			
					expect(promise).resolves.toBe(1);
				  });`,
				`it('is valid', async () => {
					const promise = loadNumber().then(number => {
						expect(typeof number).toBe('number');

						return number + 1;
					});

					expect(await promise).toBeGreaterThan(1);
				});`
			],
			invalid: []
		})
	})
})
