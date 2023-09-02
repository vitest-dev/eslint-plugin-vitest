import rule, { RULE_NAME } from '../src/rules/prefer-hooks-on-top'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    `
				describe('foo', () => {
				  beforeEach(() => {});
				  someSetupFn();
				  afterEach(() => {});
		  
				  test('bar', () => {
					someFn();
				  });
				});
			  `,
    `
				describe('foo', () => {
				  someSetupFn();
				  beforeEach(() => {});
				  afterEach(() => {});
		  
				  test('bar', () => {
					someFn();
				  });
				});
			  `
  ],
  invalid: [
    {
      code: `
					  describe('foo', () => {
						beforeEach(() => {});
						test('bar', () => {
						  someFn();
						});
			  
						beforeAll(() => {});
						test('bar', () => {
						  someFn();
						});
					  });
					`,
      errors: [
        {
          messageId: 'noHookOnTop',
          column: 7,
          line: 8
        }
      ]
    },
    {
      code: `
					  describe('foo', () => {
						beforeEach(() => {});
						test.each\`\`('bar', () => {
						  someFn();
						});
			  
						beforeAll(() => {});
						test.only('bar', () => {
						  someFn();
						});
					  });
					`,
      errors: [
        {
          messageId: 'noHookOnTop',
          column: 7,
          line: 8
        }
      ]
    },
    {
      code: `
					  describe('foo', () => {
						beforeEach(() => {});
						test.only.each\`\`('bar', () => {
						  someFn();
						});
			  
						beforeAll(() => {});
						test.only('bar', () => {
						  someFn();
						});
					  });
					`,
      errors: [
        {
          messageId: 'noHookOnTop',
          column: 7,
          line: 8
        }
      ]
    }
  ]
})

ruleTester.run(RULE_NAME, rule, {
  valid: [
    `
				  describe.skip('foo', () => {
					beforeEach(() => {});
					beforeAll(() => {});
			
					test('bar', () => {
					  someFn();
					});
				  });
			
				  describe('foo', () => {
					beforeEach(() => {});
			
					test('bar', () => {
					  someFn();
					});
				  });
				`
  ],
  invalid: [
    {
      code: `
					describe.skip('foo', () => {
					  beforeEach(() => {});
					  test('bar', () => {
						someFn();
					  });
			
					  beforeAll(() => {});
					  test('bar', () => {
						someFn();
					  });
					});
					describe('foo', () => {
					  beforeEach(() => {});
					  beforeEach(() => {});
					  beforeAll(() => {});
			
					  test('bar', () => {
						someFn();
					  });
					});
			
					describe('foo', () => {
					  test('bar', () => {
						someFn();
					  });
			
					  beforeEach(() => {});
					  beforeEach(() => {});
					  beforeAll(() => {});
					});
				  `,
      errors: [
        {
          messageId: 'noHookOnTop',
          column: 8,
          line: 8
        },
        {
          messageId: 'noHookOnTop',
          column: 8,
          line: 28
        },
        {
          messageId: 'noHookOnTop',
          column: 8,
          line: 29
        },
        {
          messageId: 'noHookOnTop',
          column: 8,
          line: 30
        }
      ]
    }
  ]
})

ruleTester.run('nested describe blocks', rule, {
  valid: [
    `
				describe('foo', () => {
				  beforeEach(() => {});
				  test('bar', () => {
					someFn();
				  });
		  
				  describe('inner_foo', () => {
					beforeEach(() => {});
					test('inner bar', () => {
					  someFn();
					});
				  });
				});
			  `
  ],
  invalid: [
    {
      code: `
				  describe('foo', () => {
					beforeAll(() => {});
					test('bar', () => {
					  someFn();
					});
		  
					describe('inner_foo', () => {
					  beforeEach(() => {});
					  test('inner bar', () => {
						someFn();
					  });
		  
					  test('inner bar', () => {
						someFn();
					  });
		  
					  beforeAll(() => {});
					  afterAll(() => {});
					  test('inner bar', () => {
						someFn();
					  });
					});
				  });
				`,
      errors: [
        {
          messageId: 'noHookOnTop',
          column: 8,
          line: 18
        },
        {
          messageId: 'noHookOnTop',
          column: 8,
          line: 19
        }
      ]
    }
  ]
})
