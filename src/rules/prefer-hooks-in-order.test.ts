import { describe, it } from 'vitest'
import ruleTester from '../utils/tester'
import rule, { RULE_NAME } from './prefer-hooks-in-order'

describe(RULE_NAME, () => {
	it(RULE_NAME, () => {
		ruleTester.run(RULE_NAME, rule, {
			valid: [
				//			'beforeAll(() => {})',
				//			'beforeEach(() => {})',
				//			'afterEach(() => {})',
				//			'afterAll(() => {})',
				//			'describe(() => {})',
				//			`beforeAll(() => {});
				//			beforeEach(() => {});
				//			afterEach(() => {});
				//			afterAll(() => {});`,
				//			`describe('foo', () => {
				//				someSetupFn();
				//				beforeEach(() => {});
				//				afterEach(() => {});

				//				test('bar', () => {
				//				  someFn();
				//				});
				//			  });`,
				//			`
				//  beforeAll(() => {});
				//  afterAll(() => {});
				// `,
				//			`
				//  beforeEach(() => {});
				//  afterEach(() => {});
				// `,
				//			`
				//  beforeAll(() => {});
				//  afterEach(() => {});
				// `,
				//			`
				//  beforeAll(() => {});
				//  beforeEach(() => {});
				// `,
				//			`
				//  afterEach(() => {});
				//  afterAll(() => {});
				// `,
				//			`
				//  beforeAll(() => {});
				//  beforeAll(() => {});
				// `,
				//			`
				//  describe('my test', () => {
				//    afterEach(() => {});
				//    afterAll(() => {});
				//  });
				// `,
				//			`
				//  describe('my test', () => {
				//    afterEach(() => {});
				//    afterAll(() => {});

				//    doSomething();

				//    beforeAll(() => {});
				//    beforeEach(() => {});
				//  });
				// `,
				//			`
				//  describe('my test', () => {
				//    afterEach(() => {});
				//    afterAll(() => {});

				//    it('is a test', () => {});

				//    beforeAll(() => {});
				//    beforeEach(() => {});
				//  });
				// `,
				//			`
				//  describe('my test', () => {
				//    afterAll(() => {});

				//    describe('when something is true', () => {
				//      beforeAll(() => {});
				//      beforeEach(() => {});
				//    });
				//  });
				// `,
				//			`
				//  describe('my test', () => {
				//    afterAll(() => {});

				//    describe('when something is true', () => {
				//      beforeAll(() => {});
				//      beforeEach(() => {});

				//      it('does something', () => {});

				//      beforeAll(() => {});
				//      beforeEach(() => {});
				//    });

				//    beforeAll(() => {});
				//    beforeEach(() => {});
				//  });

				//  describe('my test', () => {
				//    beforeAll(() => {});
				//    beforeEach(() => {});
				//    afterAll(() => {});

				//    describe('when something is true', () => {
				//      it('does something', () => {});

				//      beforeAll(() => {});
				//      beforeEach(() => {});
				//    });

				//    beforeAll(() => {});
				//    beforeEach(() => {});
				//  });
				// `,
				//			`
				//  const withDatabase = () => {
				//    beforeAll(() => {
				//      createMyDatabase();
				//    });
				//    afterAll(() => {
				//      removeMyDatabase();
				//    });
				//  };

				//  describe('my test', () => {
				//    withDatabase();

				//    afterAll(() => {});

				//    describe('when something is true', () => {
				//      beforeAll(() => {});
				//      beforeEach(() => {});

				//      it('does something', () => {});

				//      beforeAll(() => {});
				//      beforeEach(() => {});
				//    });

				//    beforeAll(() => {});
				//    beforeEach(() => {});
				//  });

				//  describe('my test', () => {
				//    beforeAll(() => {});
				//    beforeEach(() => {});
				//    afterAll(() => {});

				//    withDatabase();

				//    describe('when something is true', () => {
				//      it('does something', () => {});

				//      beforeAll(() => {});
				//      beforeEach(() => {});
				//    });

				//    beforeAll(() => {});
				//    beforeEach(() => {});
				//  });
				// `,
				//			`
				//  describe('foo', () => {
				//    beforeAll(() => {
				//      createMyDatabase();
				//    });

				//    beforeEach(() => {
				//      seedMyDatabase();
				//    });

				//    it('accepts this input', () => {
				//      // ...
				//    });

				//    it('returns that value', () => {
				//      // ...
				//    });

				//    describe('when the database has specific values', () => {
				//      const specificValue = '...';

				//      beforeEach(() => {
				//        seedMyDatabase(specificValue);
				//      });

				//      it('accepts that input', () => {
				//        // ...
				//      });

				//      it('throws an error', () => {
				//        // ...
				//      });

				//      beforeEach(() => {
				//        mockLogger();
				//      });

				//      afterEach(() => {
				//        clearLogger();
				//      });

				//      it('logs a message', () => {
				//        // ...
				//      });
				//    });

				//    afterAll(() => {
				//      removeMyDatabase();
				//    });
				//  });
				// `,
				//			`
				//  describe('A file with a lot of test', () => {
				//    beforeAll(() => {
				//      setupTheDatabase();
				//      createMocks();
				//    });

				//    beforeAll(() => {
				//      doEvenMore();
				//    });

				//    beforeEach(() => {
				//      cleanTheDatabase();
				//      resetSomeThings();
				//    });

				//    afterEach(() => {
				//      cleanTheDatabase();
				//      resetSomeThings();
				//    });

				//    afterAll(() => {
				//      closeTheDatabase();
				//      stop();
				//    });

				//    it('does something', () => {
				//      const thing = getThing();
				//      expect(thing).toBe('something');
				//    });

				//    it('throws', () => {
				//      // Do something that throws
				//    });

				//    describe('Also have tests in here', () => {
				//      afterAll(() => {});
				//      it('tests something', () => {});
				//      it('tests something else', () => {});
				//      beforeAll(()=>{});
				//    });
				//  });
				// `
			],
			invalid: [
				{
					code: `const withDatabase = () => {
						afterAll(() => {
						  removeMyDatabase();
						});
						beforeAll(() => {
						  createMyDatabase();
						});
					  };`,
					errors: [
						{
							messageId: 'reorderHooks',
							data: { currentHook: 'beforeAll', previousHook: 'afterAll' },
							column: 3,
							line: 5
						}
					]
				}
			]
		})
	})
})
