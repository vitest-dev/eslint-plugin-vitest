import { describe, it } from 'vitest'
import { ruleTester } from '../utils/test'
import rule, { RULE_NAME } from './no-duplicate-hooks'

describe(RULE_NAME, () => {
  it(`${RULE_NAME} - single describe block`, () => {
    ruleTester.run(RULE_NAME, rule, {
      valid: [
        `describe("foo", () => {
				beforeEach(() => {})
				test("bar", () => {
				  someFn();
				})
			  })`,
        `beforeEach(() => {})
			  test("bar", () => {
				someFn();
			  })`,
        `describe("foo", () => {
				beforeAll(() => {}),
				beforeEach(() => {})
				afterEach(() => {})
				afterAll(() => {})
		
				test("bar", () => {
				  someFn();
				})
			  })`
      ],
      invalid: [
        {
          code: `describe("foo", () => {
						beforeEach(() => {}),
						beforeEach(() => {}),
						test("bar", () => {
						  someFn();
						})
					  })`,
          errors: [
            {
              messageId: 'noDuplicateHooks',
              data: { hook: 'beforeEach' },
              column: 7,
              line: 3
            }
          ]
        },
        {
          code: `
					  describe.skip("foo", () => {
						afterEach(() => {}),
						afterEach(() => {}),
						test("bar", () => {
						  someFn();
						})
					  })
					`,
          errors: [
            {
              messageId: 'noDuplicateHooks',
              data: { hook: 'afterEach' },
              column: 7,
              line: 4
            }
          ]
        }
      ]
    })
  })

  it(`${RULE_NAME} - multiple describe blocks`, () => {
    ruleTester.run(RULE_NAME, rule, {
      valid: [
        `describe.skip("foo", () => {
        beforeEach(() => {}),
        beforeAll(() => {}),
        test("bar", () => {
          someFn();
        })
      })
      describe("foo", () => {
        beforeEach(() => {}),
        beforeAll(() => {}),
        test("bar", () => {
          someFn();
        })
      })`
      ],
      invalid: [
        {
          code: `describe.skip("foo", () => {
						beforeEach(() => {}),
						beforeAll(() => {}),
						test("bar", () => {
						  someFn();
						})
					  })
					  describe("foo", () => {
						beforeEach(() => {}),
						beforeEach(() => {}),
						beforeAll(() => {}),
						test("bar", () => {
						  someFn();
						})
					  })`,
          errors: [
            {
              messageId: 'noDuplicateHooks',
              data: { hook: 'beforeEach' },
              column: 7,
              line: 10
            }
          ]
        }
      ]
    })
  })

  it(`${RULE_NAME} - nested describe blocks`, () => {
    ruleTester.run(RULE_NAME, rule, {
      valid: [
        ` describe("foo", () => {
					beforeEach(() => {}),
					test("bar", () => {
					  someFn();
					})
					describe("inner_foo", () => {
					  beforeEach(() => {})
					  test("inner bar", () => {
						someFn();
					  })
					})
				  })`
      ],
      invalid: [
        {
          code: `describe.skip("foo", () => {
						beforeEach(() => {}),
						beforeAll(() => {}),
						test("bar", () => {
						  someFn();
						})
					  })
					  describe("foo", () => {
						beforeEach(() => {}),
						beforeEach(() => {}),
						beforeAll(() => {}),
						test("bar", () => {
						  someFn();
						})
					  })`,
          errors: [
            {
              messageId: 'noDuplicateHooks',
              data: { hook: 'beforeEach' },
              column: 7,
              line: 10
            }
          ]
        }
      ]
    })
  })

  it(`${RULE_NAME} - describe.each blocks`, () => {
    ruleTester.run(RULE_NAME, rule, {
      valid: [
        ` describe.each(['hello'])('%s', () => {
					beforeEach(() => {});
			
					it('is fine', () => {});
				  });`,
        `describe.each(['hello'])('%s', () => {
					beforeEach(() => {});
			
					it('is fine', () => {});
				  });`
      ],
      invalid: [
        {
          code: `describe.each(['hello'])('%s', () => {
						beforeEach(() => {});
						beforeEach(() => {});
				
						it('is not fine', () => {});
					  });`,
          errors: [
            {
              messageId: 'noDuplicateHooks',
              data: { hook: 'beforeEach' },
              column: 7,
              line: 3
            }
          ]
        },
        {
          code: ` describe('something', () => {
						describe.each(['hello'])('%s', () => {
						  beforeEach(() => {});
				
						  it('is fine', () => {});
						});
				
						describe.each(['world'])('%s', () => {
						  beforeEach(() => {});
						  beforeEach(() => {});
				
						  it('is not fine', () => {});
						});
					  });`,
          errors: [
            {
              messageId: 'noDuplicateHooks',
              data: { hook: 'beforeEach' },
              column: 9,
              line: 10
            }
          ]
        }
      ]
    })
  })
})
