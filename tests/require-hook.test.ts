import { describe, test } from 'vitest'
import rule, { RULE_NAME } from '../src/rules/require-hook'
import { ruleTester } from './ruleTester'

describe(RULE_NAME, () => {
	test(RULE_NAME, () => {
		ruleTester.run(RULE_NAME, rule, {
			valid: [
				'describe()',
				'describe("just a title")',
				`describe('a test', () =>
			        test('something', () => {
			          expect(true).toBe(true);
			    }));`,
				{
					code: `
					  import { myFn } from '../functions';
			  
					  test('myFn', () => {
						expect(myFn()).toBe(1);
					  });
					`,
					parserOptions: { sourceType: 'module' }
				},
				`
					class MockLogger {
					  log() {}
					}
			  
					test('myFn', () => {
					  expect(myFn()).toBe(1);
					});
				  `,
				`
					const { myFn } = require('../functions');
			  
					describe('myFn', () => {
					  it('returns one', () => {
						expect(myFn()).toBe(1);
					  });
					});
				  `,
				`
					describe('some tests', () => {
					  it('is true', () => {
						expect(true).toBe(true);
					  });
					});
				  `,
				`
					describe('some tests', () => {
					  it('is true', () => {
						expect(true).toBe(true);
					  });
			  
					  describe('more tests', () => {
						it('is false', () => {
						  expect(true).toBe(false);
						});
					  });
					});
				  `,
				`
					describe('some tests', () => {
					  let consoleLogSpy;
			  
					  beforeEach(() => {
						consoleLogSpy = vi.spyOn(console, 'log'); 
					  });
			  
					  it('prints a message', () => {
						printMessage('hello world');
			  
						expect(consoleLogSpy).toHaveBeenCalledWith('hello world');
					  });
					});
				  `,
				`
					let consoleErrorSpy = null; 
			  
					beforeEach(() => {
					  consoleErrorSpy = vi.spyOn(console, 'error');
					});
				  `,
				`
					let consoleErrorSpy = undefined; 
			  
					beforeEach(() => {
					  consoleErrorSpy = vi.spyOn(console, 'error');
					});
				  `,
				`
					describe('some tests', () => {
					  beforeEach(() => {
						setup();
					  });
					});
				  `,
				`
					beforeEach(() => {
					  initializeCityDatabase();
					});
			  
					afterEach(() => {
					  clearCityDatabase();
					});
			  
					test('city database has Vienna', () => {
					  expect(isCity('Vienna')).toBeTruthy();
					});
			  
					test('city database has San Juan', () => {
					  expect(isCity('San Juan')).toBeTruthy();
					});
				  `,
				`
					describe('cities', () => {
					  beforeEach(() => {
						initializeCityDatabase();
					  });
			  
					  test('city database has Vienna', () => {
						expect(isCity('Vienna')).toBeTruthy();
					  });
			  
					  test('city database has San Juan', () => {
						expect(isCity('San Juan')).toBeTruthy();
					  });
			  
					  afterEach(() => {
						clearCityDatabase();
					  });
					});
				  `,
				{
					code: `
					  enableAutoDestroy(afterEach);
					  
					  describe('some tests', () => {
						it('is false', () => {
						  expect(true).toBe(true);
						});
					  });
					`,
					options: [{ allowedFunctionCalls: ['enableAutoDestroy'] }]
				}

			],
			invalid: [
				{
					code: 'setup();',
					errors: [
						{
							messageId: 'useHook',
							line: 1,
							column: 1
						}
					]
				},
				{
					code: `
					  describe('some tests', () => {
						setup();
					  });
					`,
					errors: [
						{
							messageId: 'useHook',
							line: 3,
							column: 7
						}
					]
				},
				{
					code: `
					  let { setup } = require('./test-utils');
			  
					  describe('some tests', () => {
						setup();
					  });
					`,
					errors: [
						{
							messageId: 'useHook',
							line: 2,
							column: 8
						},
						{
							messageId: 'useHook',
							line: 5,
							column: 7
						}
					]
				},
				{
					code: `
					describe('some tests', () => {
					  setup();
			
					  it('is true', () => {
						expect(true).toBe(true);
					  });
			
					  describe('more tests', () => {
						setup();
			
						it('is false', () => {
						  expect(true).toBe(false);
						});
					  });
					});
				  `,
					errors: [
						{
							messageId: 'useHook',
							line: 3,
							column: 8
						},
						{
							messageId: 'useHook',
							line: 10,
							column: 7
						}
					]
				},
				{
					code: `
					  let consoleErrorSpy = vi.spyOn(console, 'error');
			  
					  describe('when loading cities from the api', () => {
						let consoleWarnSpy = vi.spyOn(console, 'warn');
					  });
					`,
					errors: [
						{
							messageId: 'useHook',
							line: 2,
							column: 8
						},
						{
							messageId: 'useHook',
							line: 5,
							column: 7
						}
					]
				},
				{
					code: `
					  let consoleErrorSpy = null;
			  
					  describe('when loading cities from the api', () => {
						let consoleWarnSpy = vi.spyOn(console, 'warn');
					  });
					`,
					errors: [
						{
							messageId: 'useHook',
							line: 5,
							column: 7
						}
					]
				},
				{
					code: 'let value = 1',
					errors: [
						{
							messageId: 'useHook',
							line: 1,
							column: 1
						}
					]
				},
				{
					code: 'let consoleErrorSpy, consoleWarnSpy = vi.spyOn(console, \'error\');',
					errors: [
						{
							messageId: 'useHook',
							line: 1,
							column: 1
						}
					]
				},
				{
					code: 'let consoleErrorSpy = vi.spyOn(console, \'error\'), consoleWarnSpy;',
					errors: [
						{
							messageId: 'useHook',
							line: 1,
							column: 1
						}
					]
				},
				{
					code: `
					  import { database, isCity } from '../database';
					  import { loadCities } from '../api';
			  
					  vi.mock('../api');
			  
					  const initializeCityDatabase = () => {
						database.addCity('Vienna');
						database.addCity('San Juan');
						database.addCity('Wellington');
					  };
			  
					  const clearCityDatabase = () => {
						database.clear();
					  };
			  
					  initializeCityDatabase();
			  
					  test('that persists cities', () => {
						expect(database.cities.length).toHaveLength(3);
					  });
			  
					  test('city database has Vienna', () => {
						expect(isCity('Vienna')).toBeTruthy();
					  });
			  
					  test('city database has San Juan', () => {
						expect(isCity('San Juan')).toBeTruthy();
					  });
			  
					  describe('when loading cities from the api', () => {
						let consoleWarnSpy = vi.spyOn(console, 'warn');
			  
						loadCities.mockResolvedValue(['Wellington', 'London']);
			  
						it('does not duplicate cities', async () => {
						  await database.loadCities();
			  
						  expect(database.cities).toHaveLength(4);
						});
			  
						it('logs any duplicates', async () => {
						  await database.loadCities();
			  
						  expect(consoleWarnSpy).toHaveBeenCalledWith(
							'Ignored duplicate cities: Wellington',
						  );
						});
					  });
			  
					  clearCityDatabase();
					`,
					parserOptions: { sourceType: 'module' },
					errors: [
						{
							messageId: 'useHook',
							line: 17,
							column: 8
						},
						{
							messageId: 'useHook',
							line: 32,
							column: 7
						},
						{
							messageId: 'useHook',
							line: 34,
							column: 7
						},
						{
							messageId: 'useHook',
							line: 51,
							column: 8
						}
					]
				},
				{
					code: `
					  enableAutoDestroy(afterEach);
					  
					  describe('some tests', () => {
						it('is false', () => {
						  expect(true).toBe(true);
						});
					  });
					`,
					options: [{ allowedFunctionCalls: ['someOtherName'] }],
					errors: [
						{
							messageId: 'useHook',
							line: 2,
							column: 8
						}
					]
				}
			]
		})
	})
})
