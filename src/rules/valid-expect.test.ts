import { ruleTester } from '../utils/test'
import rule, { RULE_NAME } from './valid-expect'

// describe(RULE_NAME, () => {
//  test(RULE_NAME + ' in promise', () => {
    ruleTester.run(RULE_NAME, rule, {
      valid: [
        'expect.hasAssertions',
        'expect.hasAssertions()',
        'expect("something").toEqual("else");',
        'expect(true).toBeDefined();',
        'expect([1, 2, 3]).toEqual([1, 2, 3]);',
        'expect(undefined).not.toBeDefined();',
        'test("valid-expect", () => { return expect(Promise.resolve(2)).resolves.toBeDefined(); });',
        'test("valid-expect", () => { return expect(Promise.reject(2)).rejects.toBeDefined(); });',
        'test("valid-expect", () => { return expect(Promise.resolve(2)).resolves.not.toBeDefined(); });',
        'test("valid-expect", () => { return expect(Promise.resolve(2)).rejects.not.toBeDefined(); });',
        'test("valid-expect", function () { return expect(Promise.resolve(2)).resolves.not.toBeDefined(); });',
        'test("valid-expect", function () { return expect(Promise.resolve(2)).rejects.not.toBeDefined(); });',
        'test("valid-expect", function () { return Promise.resolve(expect(Promise.resolve(2)).resolves.not.toBeDefined()); });',
        'test("valid-expect", function () { return Promise.resolve(expect(Promise.resolve(2)).rejects.not.toBeDefined()); });',
        'test("valid-expect", () => expect(Promise.resolve(2)).resolves.toBeDefined());',
        'test("valid-expect", () => expect(Promise.resolve(2)).resolves.toBeDefined());',
        'test("valid-expect", () => expect(Promise.reject(2)).rejects.toBeDefined());',
        'test("valid-expect", () => expect(Promise.reject(2)).resolves.not.toBeDefined());',
        'test("valid-expect", () => expect(Promise.reject(2)).rejects.not.toBeDefined());',
        'test("valid-expect", async () => { await expect(Promise.reject(2)).resolves.not.toBeDefined(); });',
        'test("valid-expect", async () => { await expect(Promise.reject(2)).rejects.not.toBeDefined(); });',
        'test("valid-expect", async function () { await expect(Promise.reject(2)).resolves.not.toBeDefined(); });',
        'test("valid-expect", async function () { await expect(Promise.reject(2)).rejects.not.toBeDefined(); });',
        'test("valid-expect", async () => { await Promise.resolve(expect(Promise.reject(2)).rejects.not.toBeDefined()); });',
        'test("valid-expect", async () => { await Promise.reject(expect(Promise.reject(2)).rejects.not.toBeDefined()); });',
        'test("valid-expect", async () => { await Promise.all([expect(Promise.reject(2)).rejects.not.toBeDefined(), expect(Promise.reject(2)).rejects.not.toBeDefined()]); });',
        'test("valid-expect", async () => { await Promise.race([expect(Promise.reject(2)).rejects.not.toBeDefined(), expect(Promise.reject(2)).rejects.not.toBeDefined()]); });',
        'test("valid-expect", async () => { await Promise.allSettled([expect(Promise.reject(2)).rejects.not.toBeDefined(), expect(Promise.reject(2)).rejects.not.toBeDefined()]); });',
        'test("valid-expect", async () => { await Promise.any([expect(Promise.reject(2)).rejects.not.toBeDefined(), expect(Promise.reject(2)).rejects.not.toBeDefined()]); });',
        'test("valid-expect", async () => { return expect(Promise.reject(2)).resolves.not.toBeDefined().then(() => console.log("valid-case")); });',
        'test("valid-expect", async () => { return expect(Promise.reject(2)).resolves.not.toBeDefined().then(() => console.log("valid-case")).then(() => console.log("another valid case")); });',
        'test("valid-expect", async () => { return expect(Promise.reject(2)).resolves.not.toBeDefined().catch(() => console.log("valid-case")); });',
        'test("valid-expect", async () => { return expect(Promise.reject(2)).resolves.not.toBeDefined().then(() => console.log("valid-case")).catch(() => console.log("another valid case")); });',
        'test("valid-expect", async () => { return expect(Promise.reject(2)).resolves.not.toBeDefined().then(() => { expect(someMock).toHaveBeenCalledTimes(1); }); });',
        'test("valid-expect", async () => { await expect(Promise.reject(2)).resolves.not.toBeDefined().then(() => console.log("valid-case")); });',
        'test("valid-expect", async () => { await expect(Promise.reject(2)).resolves.not.toBeDefined().then(() => console.log("valid-case")).then(() => console.log("another valid case")); });',
        'test("valid-expect", async () => { await expect(Promise.reject(2)).resolves.not.toBeDefined().catch(() => console.log("valid-case")); });',
        'test("valid-expect", async () => { await expect(Promise.reject(2)).resolves.not.toBeDefined().then(() => console.log("valid-case")).catch(() => console.log("another valid case")); });',
        'test("valid-expect", async () => { await expect(Promise.reject(2)).resolves.not.toBeDefined().then(() => { expect(someMock).toHaveBeenCalledTimes(1); }); });',
        ` test("valid-expect", () => {
			        return expect(functionReturningAPromise()).resolves.toEqual(1).then(() => {
			          return expect(Promise.resolve(2)).resolves.toBe(1);
			        });
			      });
			    `,
        ` test("valid-expect", () => {
			        return expect(functionReturningAPromise()).resolves.toEqual(1).then(async () => {
			          await expect(Promise.resolve(2)).resolves.toBe(1);
			        });
			      });
				`,
        ` test("valid-expect", () => {
			        return expect(functionReturningAPromise()).resolves.toEqual(1).then(() => expect(Promise.resolve(2)).resolves.toBe(1));
			      });
			    `,
        ` expect.extend({
			        toResolve(obj) {
			          return this.isNot
			            ? expect(obj).toBe(true)
			            : expect(obj).resolves.not.toThrow();
			        }
			      });
			    `,
        ` expect.extend({
		        toResolve(obj) {
		          return this.isNot
		            ? expect(obj).resolves.not.toThrow()
		            : expect(obj).toBe(true);
		        }
		      });
		    `,
        ` expect.extend({
				  toResolve(obj) {
					return this.isNot
					  ? expect(obj).toBe(true)
					  : anotherCondition
					  ? expect(obj).resolves.not.toThrow()
					  : expect(obj).toBe(false)
				  }
				});
			  `,
        {
          code: 'expect(1).toBe(2);',
          options: [{ maxArgs: 2 }]
        },
        {
          code: 'expect(1, "1 !== 2").toBe(2);',
          options: [{ maxArgs: 2 }]
        },
        {
          code: 'test("valid-expect", () => { expect(2).not.toBe(2); });',
          options: [{ asyncMatchers: ['toRejectWith'] }]
        },
        {
          code: 'test("valid-expect", () => { expect(Promise.reject(2)).toRejectWith(2); });',
          options: [{ asyncMatchers: ['toResolveWith'] }]
        },
        {
          code: 'test("valid-expect", async () => { await expect(Promise.resolve(2)).toResolve(); });',
          options: [{ asyncMatchers: ['toResolveWith'] }]
        },
        {
          code: 'test("valid-expect", async () => { expect(Promise.resolve(2)).toResolve(); });',
          options: [{ asyncMatchers: ['toResolveWith'] }]
        }
      ],
      invalid: [
        {
          code: 'expect().toBe(2);',
          options: [{ minArgs: undefined, maxArgs: undefined }],
          errors: [
            {
              messageId: 'notEnoughArgs',
              data: {
                s: '',
                amount: 1
              }
            }
          ]
        },
        {
          code: 'expect().toBe(true);',
          errors: [
            {
              endColumn: 8,
              column: 7,
              messageId: 'notEnoughArgs',
              data: {
                s: '',
                amount: 1
              }
            }
          ]
        },
        {
          code: 'expect().toEqual("something");',
          errors: [
            {
              endColumn: 8,
              column: 7,
              messageId: 'notEnoughArgs',
              data: {
                s: '',
                amount: 1
              }
            }
          ]
        },
        {
          code: 'expect("something", "else").toEqual("something");',
          errors: [
            {
              endColumn: 28,
              column: 21,
              messageId: 'tooManyArgs',
              data: {
                s: '',
                amount: 1
              }
            }
          ]
        },
        {
          code: 'expect("something", "else", "entirely").toEqual("something");',
          options: [{ maxArgs: 2 }],
          errors: [
            {
              endColumn: 40,
              column: 29,
              messageId: 'tooManyArgs',
              data: {
                s: 's',
                amount: 2
              }
            }
          ]
        },
        {
          code: 'expect("something", "else", "entirely").toEqual("something");',
          options: [{ maxArgs: 2, minArgs: 2 }],
          errors: [
            {
              endColumn: 40,
              column: 29,
              messageId: 'tooManyArgs',
              data: {
                s: 's',
                amount: 2
              }
            }
          ]
        },
        {
          code: 'expect("something", "else", "entirely").toEqual("something");',
          options: [{ maxArgs: 2, minArgs: 1 }],
          errors: [
            {
              endColumn: 40,
              column: 29,
              messageId: 'tooManyArgs',
              data: {
                s: 's',
                amount: 2
              }
            }
          ]
        },
        {
          code: 'expect("something").toEqual("something");',
          options: [{ minArgs: 2 }],
          errors: [
            {
              endColumn: 8,
              column: 7,
              messageId: 'notEnoughArgs',
              data: {
                s: 's',
                amount: 2
              }
            }
          ]
        },
        {
          code: 'expect("something", "else").toEqual("something");',
          options: [{ maxArgs: 1, minArgs: 3 }],
          errors: [
            {
              endColumn: 8,
              column: 7,
              messageId: 'notEnoughArgs',
              data: {
                s: 's',
                amount: 3
              }
            },
            {
              endColumn: 28,
              column: 21,
              messageId: 'tooManyArgs',
              data: {
                s: '',
                amount: 1
              }
            }
          ]
        },
        {
          code: 'expect("something");',
          errors: [{ endColumn: 20, column: 1, messageId: 'matcherNotFound' }]
        },
        {
          code: 'expect();',
          errors: [{ endColumn: 9, column: 1, messageId: 'matcherNotFound' }]
        },
        {
          code: 'expect(true).toBeDefined;',
          errors: [
            {
              endColumn: 25,
              column: 14,
              messageId: 'matcherNotCalled'
            }
          ]
        },
        {
          code: 'expect(true).not.toBeDefined;',
          errors: [
            {
              endColumn: 29,
              column: 18,
              messageId: 'matcherNotCalled'
            }
          ]
        },
        {
          code: 'expect(true).nope.toBeDefined;',
          errors: [
            {
              endColumn: 30,
              column: 19,
              messageId: 'matcherNotCalled'
            }
          ]
        },
        {
          code: 'expect(true).nope.toBeDefined();',
          errors: [
            {
              endColumn: 32,
              column: 1,
              messageId: 'modifierUnknown'
            }
          ]
        },
        {
          code: 'expect(true).not.resolves.toBeDefined();',
          errors: [
            {
              endColumn: 40,
              column: 1,
              messageId: 'modifierUnknown'
            }
          ]
        },
        {
          code: 'expect(true).not.not.toBeDefined();',
          errors: [
            {
              endColumn: 35,
              column: 1,
              messageId: 'modifierUnknown'
            }
          ]
        },
        {
          code: 'expect(true).resolves.not.exactly.toBeDefined();',
          errors: [
            {
              endColumn: 48,
              column: 1,
              messageId: 'modifierUnknown'
            }
          ]
        },
        {
          code: 'expect(true).resolves;',
          errors: [
            {
              endColumn: 22,
              column: 14,
              messageId: 'matcherNotFound'
            }
          ]
        },
        {
          code: 'expect(true).rejects;',
          errors: [
            {
              endColumn: 21,
              column: 14,
              messageId: 'matcherNotFound'
            }
          ]
        },
        {
          code: 'expect(true).not;',
          errors: [
            {
              endColumn: 17,
              column: 14,
              messageId: 'matcherNotFound'
            }
          ]
        },
        {
          code: 'expect(Promise.resolve(2)).resolves.toBeDefined();',
          errors: [
            {
              column: 1,
              endColumn: 50,
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' }
            }
          ]
        },
        {
          code: 'expect(Promise.resolve(2)).rejects.toBeDefined();',
          errors: [
            {
              column: 1,
              endColumn: 49,
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' }
            }
          ]
        },
        {
          code: 'expect(Promise.resolve(2)).resolves.toBeDefined();',
          options: [{ alwaysAwait: true }],
          errors: [
            {
              column: 1,
              endColumn: 50,
              messageId: 'asyncMustBeAwaited'
            }
          ]
        },
        {
          code: `
					expect.extend({
					  toResolve(obj) {
						this.isNot
						  ? expect(obj).toBe(true)
						  : expect(obj).resolves.not.toThrow();
					  }
					});
				  `,
          errors: [
            {
              column: 11,
              endColumn: 45,
              messageId: 'asyncMustBeAwaited'
            }
          ]
        },
        {
          code: `
					expect.extend({
					  toResolve(obj) {
						this.isNot
						  ? expect(obj).resolves.not.toThrow()
						  : expect(obj).toBe(true);
					  }
					});
				  `,
          errors: [
            {
              column: 11,
              endColumn: 45,
              messageId: 'asyncMustBeAwaited'
            }
          ]
        },
        {
          code: 'test("valid-expect", () => { expect(Promise.resolve(2)).resolves.toBeDefined(); });',
          errors: [
            {
              column: 30,
              endColumn: 79,
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' }
            }
          ]
        },
        {
          code: 'test("valid-expect", () => { expect(Promise.resolve(2)).toResolve(); });',
          errors: [
            {
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' },
              column: 30,
              line: 1
            }
          ]
        },
        {
          code: 'test("valid-expect", () => { expect(Promise.resolve(2)).toResolve(); });',
          options: [{ asyncMatchers: undefined }],
          errors: [
            {
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' },
              column: 30,
              line: 1
            }
          ]
        },
        {
          code: 'test("valid-expect", () => { expect(Promise.resolve(2)).toReject(); });',
          errors: [
            {
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' },
              column: 30,
              line: 1
            }
          ]
        },
        {
          code: 'test("valid-expect", () => { expect(Promise.resolve(2)).not.toReject(); });',
          errors: [
            {
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' },
              column: 30,
              line: 1
            }
          ]
        },
        {
          code: 'test("valid-expect", () => { expect(Promise.resolve(2)).resolves.not.toBeDefined(); });',
          errors: [
            {
              column: 30,
              endColumn: 83,
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' }
            }
          ]
        },
        {
          code: 'test("valid-expect", () => { expect(Promise.resolve(2)).rejects.toBeDefined(); });',
          errors: [
            {
              column: 30,
              endColumn: 78,
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' }
            }
          ]
        },
        {
          code: 'test("valid-expect", () => { expect(Promise.resolve(2)).rejects.not.toBeDefined(); });',
          errors: [
            {
              column: 30,
              endColumn: 82,
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' }
            }
          ]
        },
        {
          code: 'test("valid-expect", async () => { expect(Promise.resolve(2)).resolves.toBeDefined(); });',
          errors: [
            {
              column: 36,
              endColumn: 85,
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' }
            }
          ]
        },
        {
          code: 'test("valid-expect", async () => { expect(Promise.resolve(2)).resolves.not.toBeDefined(); });',
          errors: [
            {
              column: 36,
              endColumn: 89,
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' }
            }
          ]
        },
        {
          code: 'test("valid-expect", () => { expect(Promise.reject(2)).toRejectWith(2); });',
          options: [{ asyncMatchers: ['toRejectWith'] }],
          errors: [
            {
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' },
              column: 30
            }
          ]
        },
        {
          code: 'test("valid-expect", () => { expect(Promise.reject(2)).rejects.toBe(2); });',
          options: [{ asyncMatchers: ['toRejectWith'] }],
          errors: [
            {
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' },
              column: 30
            }
          ]
        },
        {
          code: `
					  test("valid-expect", async () => {
						expect(Promise.resolve(2)).resolves.not.toBeDefined();
						expect(Promise.resolve(1)).rejects.toBeDefined();
					  });
					`,
          errors: [
            {
              line: 3,
              column: 7,
              endColumn: 60,
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' }
            },
            {
              line: 4,
              column: 7,
              endColumn: 55,
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' }
            }
          ]
        },
        {
          code: `
					  test("valid-expect", async () => {
						await expect(Promise.resolve(2)).resolves.not.toBeDefined();
						expect(Promise.resolve(1)).rejects.toBeDefined();
					  });
					`,
          errors: [
            {
              line: 4,
              column: 7,
              endColumn: 55,
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' }
            }
          ]
        },
        {
          code: `
					  test("valid-expect", async () => {
						expect(Promise.resolve(2)).resolves.not.toBeDefined();
						return expect(Promise.resolve(1)).rejects.toBeDefined();
					  });
					`,
          options: [{ alwaysAwait: true }],
          errors: [
            {
              line: 3,
              column: 7,
              endColumn: 60,
              messageId: 'asyncMustBeAwaited'
            },
            {
              line: 4,
              column: 14,
              endColumn: 62,
              messageId: 'asyncMustBeAwaited'
            }
          ]
        },
        {
          code: `
					  test("valid-expect", async () => {
						expect(Promise.resolve(2)).resolves.not.toBeDefined();
						return expect(Promise.resolve(1)).rejects.toBeDefined();
					  });
					`,
          errors: [
            {
              line: 3,
              column: 7,
              endColumn: 60,
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' }
            }
          ]
        },
        {
          code: `
					  test("valid-expect", () => {
						Promise.x(expect(Promise.resolve(2)).resolves.not.toBeDefined());
					  });
					`,
          errors: [
            {
              line: 3,
              column: 7,
              endColumn: 71,
              messageId: 'promisesWithAsyncAssertionsMustBeAwaited',
              data: { orReturned: ' or returned' }
            }
          ]
        },
        {
          code: `
					test("valid-expect", () => {
					  Promise.resolve(expect(Promise.resolve(2)).resolves.not.toBeDefined());
					});
				  `,
          options: [{ alwaysAwait: true }],
          errors: [
            {
              line: 3,
              column: 8,
              endColumn: 78,
              messageId: 'promisesWithAsyncAssertionsMustBeAwaited'
            }
          ]
        },
        {
          code: `
					test("valid-expect", () => {
						Promise.all([
						  expect(Promise.resolve(2)).resolves.not.toBeDefined(),
						  expect(Promise.resolve(3)).resolves.not.toBeDefined(),
						]);
					  });
					  `,
          errors: [
            {
              line: 3,
              column: 7,
              endLine: 6,
              endColumn: 9,
              messageId: 'promisesWithAsyncAssertionsMustBeAwaited',
              data: { orReturned: ' or returned' }
            }
          ]
        },
        {
          code: `
					test("valid-expect", () => {
						Promise.x([
						  expect(Promise.resolve(2)).resolves.not.toBeDefined(),
						  expect(Promise.resolve(3)).resolves.not.toBeDefined(),
						]);
					  });`,
          errors: [
            {
              line: 3,
              column: 7,
              endLine: 6,
              endColumn: 9,
              messageId: 'promisesWithAsyncAssertionsMustBeAwaited',
              data: { orReturned: ' or returned' }
            }
          ]
        },
        {
          code: `
					  test("valid-expect", () => {
						const assertions = [
						  expect(Promise.resolve(2)).resolves.not.toBeDefined(),
						  expect(Promise.resolve(3)).resolves.not.toBeDefined(),
						]
					  });
					`,
          errors: [
            {
              line: 4,
              column: 9,
              endLine: 4,
              endColumn: 62,
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' }
            },
            {
              line: 5,
              column: 9,
              endLine: 5,
              endColumn: 62,
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' }
            }
          ]
        },
        {
          code: `
					test("valid-expect", () => {
					  const assertions = [
						expect(Promise.resolve(2)).toResolve(),
						expect(Promise.resolve(3)).toReject(),
					  ]
					});
				  `,
          errors: [
            {
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' },
              column: 7,
              line: 4
            },
            {
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' },
              column: 7,
              line: 5
            }
          ]
        },
        {
          code: `
					  test("valid-expect", () => {
						const assertions = [
						  expect(Promise.resolve(2)).not.toResolve(),
						  expect(Promise.resolve(3)).resolves.toReject(),
						]
					  });
					`,
          errors: [
            {
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' },
              column: 9,
              line: 4
            },
            {
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' },
              column: 9,
              line: 5
            }
          ]
        },
        {
          code: 'expect(Promise.resolve(2)).resolves.toBe;',
          errors: [
            {
              column: 37,
              endColumn: 41,
              messageId: 'matcherNotCalled'
            }
          ]
        },
        {
          code: `
					  test("valid-expect", () => {
						return expect(functionReturningAPromise()).resolves.toEqual(1).then(() => {
						  expect(Promise.resolve(2)).resolves.toBe(1);
						});
					  });
					`,
          errors: [
            {
              line: 4,
              column: 9,
              endLine: 4,
              endColumn: 52,
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' }
            }
          ]
        },
        {
          code: `
					  test("valid-expect", () => {
						return expect(functionReturningAPromise()).resolves.toEqual(1).then(async () => {
						  await expect(Promise.resolve(2)).resolves.toBe(1);
						  expect(Promise.resolve(4)).resolves.toBe(4);
						});
					  });
					`,
          errors: [
            {
              line: 5,
              column: 9,
              endLine: 5,
              endColumn: 52,
              messageId: 'asyncMustBeAwaited',
              data: { orReturned: ' or returned' }
            }
          ]
        },
        {
          code: `
					  test("valid-expect", async () => {
						await expect(Promise.resolve(1));
					  });
					`,
          errors: [{ endColumn: 39, column: 13, messageId: 'matcherNotFound' }]
        }
      ]
    })
//  })
// })
