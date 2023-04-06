import { describe, it } from 'vitest'
// import ruleTester from '../utils/tester'
import { TSESLint } from '@typescript-eslint/utils'
import rule, { RULE_NAME } from './valid-expect-in-promise'

const ruleTester = new TSESLint.RuleTester({
	parser: require.resolve('@typescript-eslint/parser'),
	parserOptions: {
		ecmaVersion: 2017
	}
})

describe(RULE_NAME, () => {
	it(RULE_NAME, () => {
		ruleTester.run(RULE_NAME, rule, {
			valid: [
				'test(\'something\', () => Promise.resolve().then(() => expect(1).toBe(2)));'
				// 'Promise.resolve().then(() => expect(1).toBe(2))'
				// 'const x = Promise.resolve().then(() => expect(1).toBe(2))'
			],
			invalid: [
				// {
				//	code: `const myFn = () => {
				//	Promise.resolve().then(() => {
				//	  expect(true).toBe(false);
				//	});
				//  };

				//  it('it1', () => {
				//	somePromise.then(() => {
				//	  expect(someThing).toEqual(true);
				//	});
				//  });`,
				//	errors: [
				//		{
				//			messageId: 'expectInFloatingPromise',
				//			column: 6,
				//			line: 8,
				//			endColumn: 9
				//		}
				//	]
				// },
				// {
				//	code: `it('it1', () => {
				//		somePromise.then(() => {
				//		  expect(someThing).toEqual(true);
				//		});
				//	  });`,
				//	errors: [
				//		{
				//			column: 7,
				//			endColumn: 10,
				//			messageId: 'expectInFloatingPromise'
				//		}
				//	]
				// },
				// {
				//	code: `it('it1', () => {
				//		somePromise.finally(() => {
				//		  expect(someThing).toEqual(true);
				//		});
				//	  });`,
				//	errors: [
				//		{ messageId: 'expectInFloatingPromise', column: 7, endColumn: 10 }
				//	]
				// },
				// {
				//	code: `
				//	it('it1', () => {
				//	  somePromise['then'](() => {
				//		expect(someThing).toEqual(true);
				//	  });
				//	});
				//   `,
				//	errors: [
				//		{ column: 8, endColumn: 11, messageId: 'expectInFloatingPromise' }
				//	]
				// },
				// {
				//	code: `
				//	  it('it1', function() {
				//		getSomeThing().getPromise().then(function() {
				//		  expect(someThing).toEqual(true);
				//		});
				//	  });
				//	`,
				//	errors: [
				//		{ column: 7, endColumn: 10, messageId: 'expectInFloatingPromise' }
				//	]
				// },
				// {
				//	code: `
				//	  it('it1', function() {
				//		Promise.resolve().then(function() {
				//		  expect(someThing).toEqual(true);
				//		});
				//	  });
				//	`,
				//	errors: [
				//		{ column: 7, endColumn: 10, messageId: 'expectInFloatingPromise' }
				//	]
				// },
				// {
				//	code: `it('it1', function() {
				//		somePromise.catch(function() {
				//		  expect(someThing).toEqual(true)
				//		})
				//	  })`,
				//	errors: [
				//		{ column: 7, endColumn: 9, messageId: 'expectInFloatingPromise' }
				//	]
				// },
				// {
				//	code: `
				//	  xtest('it1', function() {
				//		somePromise.catch(function() {
				//		  expect(someThing).toEqual(true)
				//		})
				//	  })
				//	`,
				//	errors: [
				//		{ column: 7, endColumn: 9, messageId: 'expectInFloatingPromise' }
				//	]
				// },
				// {
				//	code: `
				//	  it('is valid', async () => {
				//		const promise = loadNumber().then(number => {
				//		  expect(typeof number).toBe('number');

				//		  return number + 1;
				//		});

				//		expect(anotherPromise).resolves.toBe(1);
				//	  });
				//	`,
				//	errors: [
				//		{
				//			messageId: 'expectInFloatingPromise',
				//			line: 3,
				//			column: 13
				//		}
				//	]
				// }
			]
		})
	})
})
