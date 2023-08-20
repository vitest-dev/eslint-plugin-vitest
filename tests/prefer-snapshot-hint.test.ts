import { describe, it } from 'vitest'
<<<<<<< HEAD:tests/prefer-snapshot-hint.test.ts
import rule, { RULE_NAME } from '../src/rules/prefer-snapshot-hint'
import { ruleTester } from './ruleTester'
=======
import { ruleTester } from '../utils/test'
import rule, { RULE_NAME } from './prefer-snapshot-hint'
>>>>>>> 0b9528e (chore: update):src/rules/prefer-snapshot-hint.test.ts

describe(RULE_NAME, () => {
	it(`${RULE_NAME} (always)`, () => {
		ruleTester.run(`${RULE_NAME} - always`, rule, {
			valid: [],
			invalid: [
				{
					code: 'expect(1).toMatchSnapshot();',
					options: ['always'],
					errors: [
						{
							messageId: 'missingHint',
							column: 11,
							line: 1
						}
					]
				},
				{
					code: 'expect(1).toMatchSnapshot({});',
					options: ['always'],
					errors: [
						{
							messageId: 'missingHint',
							column: 11,
							line: 1
						}
					]
				},
				{
					code: `
					  const x = "we can't know if this is a string or not"; 
					  expect(1).toMatchSnapshot(x);
					`,
					options: ['always'],
					errors: [
						{
							messageId: 'missingHint',
							column: 18,
							line: 3
						}
					]
				},
				{
					code: 'expect(1).toThrowErrorMatchingSnapshot();',
					options: ['always'],
					errors: [
						{
							messageId: 'missingHint',
							column: 11,
							line: 1
						}
					]
				},
				{
					code: `
					  it('is true', () => {
						expect(1).toMatchSnapshot();
					  });
					`,
					options: ['always'],
					errors: [
						{
							messageId: 'missingHint',
							column: 17,
							line: 3
						}
					]
				},
				{
					code: `
					  it('is true', () => {
						expect(1).toMatchSnapshot();
						expect(2).toMatchSnapshot();
					  });
					`,
					options: ['always'],
					errors: [
						{
							messageId: 'missingHint',
							column: 17,
							line: 3
						},
						{
							messageId: 'missingHint',
							column: 17,
							line: 4
						}
					]
				},
				{
					code: `
					  it('is true', () => {
						expect(1).toMatchSnapshot();
						expect(2).toThrowErrorMatchingSnapshot("my error");
					  });
					`,
					options: ['always'],
					errors: [
						{
							messageId: 'missingHint',
							column: 17,
							line: 3
						}
					]
				}
			]
		})
	})

	it(`${RULE_NAME} (multi)`, () => {
		ruleTester.run(RULE_NAME, rule, {
			valid: [
				{
					code: 'expect(something).toStrictEqual(somethingElse);',
					options: ['multi']
				},
				{
					code: 'a().toEqual(\'b\')',
					options: ['multi']
				},
				{
					code: 'expect(a);',
					options: ['multi']
				},
				{
					code: 'expect(1).toMatchSnapshot({}, "my snapshot");',
					options: ['multi']
				},
				{
					code: 'expect(1).toThrowErrorMatchingSnapshot("my snapshot");',
					options: ['multi']
				},
				{
					code: 'expect(1).toMatchSnapshot({});',
					options: ['multi']
				},
				{
					code: 'expect(1).toThrowErrorMatchingSnapshot();',
					options: ['multi']
				},
				{
					code: `
					  it('is true', () => {
						expect(1).toMatchSnapshot();
					  });
					`,
					options: ['multi']
				},
				{
					code: `
					  it('is true', () => {
						expect(1).toMatchSnapshot(undefined, 'my first snapshot');
					  });
					`,
					options: ['multi']
				},
				{
					code: `
					  describe('my tests', () => {
						it('is true', () => {
						  expect(1).toMatchSnapshot('this is a hint, all by itself');
						});
			  
						it('is false', () => {
						  expect(2).toMatchSnapshot('this is a hint');
						  expect(2).toMatchSnapshot('and so is this');
						});
					  });
					`,
					options: ['multi']
				},
				{
					code: `
					  it('is true', () => {
						expect(1).toMatchSnapshot();
					  });
			  
					  it('is false', () => {
						expect(2).toMatchSnapshot('this is a hint');
						expect(2).toMatchSnapshot('and so is this');
					  });
					`,
					options: ['multi']
				},
				{
					code: `
					  it('is true', () => {
						expect(1).toMatchSnapshot();
					  });
			  
					  it('is false', () => {
						expect(2).toThrowErrorMatchingSnapshot();
					  });
					`,
					options: ['multi']
				},
				{
					code: `
					  it('is true', () => {
						expect(1).toStrictEqual(1);
						expect(1).toStrictEqual(2);
						expect(1).toMatchSnapshot();
					  });
			  
					  it('is false', () => {
						expect(1).toStrictEqual(1);
						expect(1).toStrictEqual(2);
						expect(2).toThrowErrorMatchingSnapshot();
					  });
					`,
					options: ['multi']
				},
				{
					code: `
					  it('is true', () => {
						expect(1).toMatchInlineSnapshot();
					  });
			  
					  it('is false', () => {
						expect(1).toMatchInlineSnapshot();
						expect(1).toMatchInlineSnapshot();
						expect(1).toThrowErrorMatchingInlineSnapshot();
					  });
					`,
					options: ['multi']
				},
				{
					code: `
					  it('is true', () => {
						expect(1).toMatchSnapshot();
					  });
			  
					  it('is false', () => {
						expect(1).toMatchSnapshot();
					  });
					`,
					options: ['multi']
				},
				{
					code: `
					  const myReusableTestBody = (value, snapshotHint) => {
						const innerFn = anotherValue => {
						  expect(anotherValue).toMatchSnapshot();
			  
						  expect(value).toBe(1);
						};
			  
						expect(value).toBe(1);
					  };
			  
					  it('my test', () => {
						expect(1).toMatchSnapshot();
					  });
					`,
					options: ['multi']
				},
				{
					code: `
					  const myReusableTestBody = (value, snapshotHint) => {
						const innerFn = anotherValue => {
						  expect(value).toBe(1);
						};
			  
						expect(value).toBe(1);
						expect(anotherValue).toMatchSnapshot();
					  };
			  
					  it('my test', () => {
						expect(1).toMatchSnapshot();
					  });
					`,
					options: ['multi']
				},
				{
					code: `
					  const myReusableTestBody = (value, snapshotHint) => {
						const innerFn = anotherValue => {
						  expect(anotherValue).toMatchSnapshot();
			  
						  expect(value).toBe(1);
						};
			  
						expect(value).toBe(1);
					  };
			  
					  expect(1).toMatchSnapshot();
					`,
					options: ['multi']
				}
			],
			invalid: [
				{
					code: `
					  it('is true', () => {
						expect(1).toMatchSnapshot();
						expect(2).toMatchSnapshot();
					  });
					`,
					options: ['multi'],
					errors: [
						{
							messageId: 'missingHint',
							column: 17,
							line: 3
						},
						{
							messageId: 'missingHint',
							column: 17,
							line: 4
						}
					]
				},
				{
					code: `
					  it('is true', () => {
						expect(1).toMatchSnapshot();
						expect(2).toThrowErrorMatchingSnapshot();
					  });
					`,
					options: ['multi'],
					errors: [
						{
							messageId: 'missingHint',
							column: 17,
							line: 3
						},
						{
							messageId: 'missingHint',
							column: 17,
							line: 4
						}
					]
				},
				{
					code: `
					  it('is true', () => {
						expect(1).toThrowErrorMatchingSnapshot();
						expect(2).toMatchSnapshot();
					  });
					`,
					options: ['multi'],
					errors: [
						{
							messageId: 'missingHint',
							column: 17,
							line: 3
						},
						{
							messageId: 'missingHint',
							column: 17,
							line: 4
						}
					]
				},
				{
					code: `
					  it('is true', () => {
						expect(1).toMatchSnapshot({});
						expect(2).toMatchSnapshot({});
					  });
					`,
					options: ['multi'],
					errors: [
						{
							messageId: 'missingHint',
							column: 17,
							line: 3
						},
						{
							messageId: 'missingHint',
							column: 17,
							line: 4
						}
					]
				},
				{
					code: `
					  it('is true', () => {
						expect(1).toMatchSnapshot({});
						{
						  expect(2).toMatchSnapshot({});
						}
					  });
					`,
					options: ['multi'],
					errors: [
						{
							messageId: 'missingHint',
							column: 17,
							line: 3
						},
						{
							messageId: 'missingHint',
							column: 19,
							line: 5
						}
					]
				},
				{
					code: `
					  it('is true', () => {
						{ expect(1).toMatchSnapshot(); }
						{ expect(2).toMatchSnapshot(); }
					  });
					`,
					options: ['multi'],
					errors: [
						{
							messageId: 'missingHint',
							column: 19,
							line: 3
						},
						{
							messageId: 'missingHint',
							column: 19,
							line: 4
						}
					]
				},
				{
					code: `
					  it('is true', () => {
						expect(1).toMatchSnapshot();
						expect(2).toMatchSnapshot(undefined, 'my second snapshot');
					  });
					`,
					options: ['multi'],
					errors: [
						{
							messageId: 'missingHint',
							column: 17,
							line: 3
						}
					]
				},
				{
					code: `
					  it('is true', () => {
						expect(1).toMatchSnapshot({});
						expect(2).toMatchSnapshot(undefined, 'my second snapshot');
					  });
					`,
					options: ['multi'],
					errors: [
						{
							messageId: 'missingHint',
							column: 17,
							line: 3
						}
					]
				},
				{
					code: `
					  it('is true', () => {
						expect(1).toMatchSnapshot({}, 'my first snapshot');
						expect(2).toMatchSnapshot(undefined);
					  });
					`,
					options: ['multi'],
					errors: [
						{
							messageId: 'missingHint',
							column: 17,
							line: 4
						}
					]
				},
				{
					code: `
					  it('is true', () => {
						expect(1).toMatchSnapshot({}, 'my first snapshot');
						expect(2).toMatchSnapshot(undefined);
						expect(2).toMatchSnapshot();
					  });
					`,
					options: ['multi'],
					errors: [
						{
							messageId: 'missingHint',
							column: 17,
							line: 4
						},
						{
							messageId: 'missingHint',
							column: 17,
							line: 5
						}
					]
				},
				{
					code: `
					  it('is true', () => {
						expect(2).toMatchSnapshot();
						expect(1).toMatchSnapshot({}, 'my second snapshot');
						expect(2).toMatchSnapshot();
					  });
					`,
					options: ['multi'],
					errors: [
						{
							messageId: 'missingHint',
							column: 17,
							line: 3
						},
						{
							messageId: 'missingHint',
							column: 17,
							line: 5
						}
					]
				},
				{
					code: `
					  it('is true', () => {
						expect(2).toMatchSnapshot(undefined);
						expect(2).toMatchSnapshot();
						expect(1).toMatchSnapshot(null, 'my third snapshot');
					  });
					`,
					options: ['multi'],
					errors: [
						{
							messageId: 'missingHint',
							column: 17,
							line: 3
						},
						{
							messageId: 'missingHint',
							column: 17,
							line: 4
						}
					]
				},
				{
					code: `
					  describe('my tests', () => {
						it('is true', () => {
						  expect(1).toMatchSnapshot();
						});
			  
						it('is false', () => {
						  expect(2).toMatchSnapshot();
						  expect(2).toMatchSnapshot();
						});
					  });
					`,
					options: ['multi'],
					errors: [
						{
							messageId: 'missingHint',
							column: 19,
							line: 8
						},
						{
							messageId: 'missingHint',
							column: 19,
							line: 9
						}
					]
				},
				{
					code: `
					  describe('my tests', () => {
						it('is true', () => {
						  expect(1).toMatchSnapshot();
						});
			  
						it('is false', () => {
						  expect(2).toMatchSnapshot();
						  expect(2).toMatchSnapshot('hello world');
						});
					  });
					`,
					options: ['multi'],
					errors: [
						{
							messageId: 'missingHint',
							column: 19,
							line: 8
						}
					]
				},
				{
					code: `
					  describe('my tests', () => {
						describe('more tests', () => {
						  it('is true', () => {
							expect(1).toMatchSnapshot();
						  });
						});
			  
						it('is false', () => {
						  expect(2).toMatchSnapshot();
						  expect(2).toMatchSnapshot('hello world');
						});
					  });
					`,
					options: ['multi'],
					errors: [
						{
							messageId: 'missingHint',
							column: 19,
							line: 10
						}
					]
				},
				{
					code: `
					  describe('my tests', () => {
						it('is true', () => {
						  expect(1).toMatchSnapshot();
						});
			  
						describe('more tests', () => {
						  it('is false', () => {
							expect(2).toMatchSnapshot();
							expect(2).toMatchSnapshot('hello world');
						  });
						});
					  });
					`,
					options: ['multi'],
					errors: [
						{
							messageId: 'missingHint',
							column: 18,
							line: 9
						}
					]
				}
			]
		})
	})
})
