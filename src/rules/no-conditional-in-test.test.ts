import { describe, it } from 'vitest'
import { ruleTester } from '../utils/test'
import rule, { RULE_NAME } from './no-conditional-tests'

describe(RULE_NAME, () => {
  it('conditional expressions', () => {
    ruleTester.run(`${RULE_NAME}-conditional expressions`, rule, {
      valid: [
        'const x = y ? 1 : 0',
        `const foo = function (bar) {
					return foo ? bar : null;
				  };
				  it('foo', () => {
					foo();
				  });`,
        `it.concurrent('foo', () => {
					switch('bar') {}
				  })`
      ],
      invalid: [
        {
          code: `it('foo', function () {
						const foo = function (bar) {
						  return foo ? bar : null;
						};
					  });`,
          errors: [
            {
              messageId: 'noConditionalTests'
            }
          ]
        }
      ]
    })
  })

  it('switch statements', () => {
    ruleTester.run(`${RULE_NAME}-switch statements`, rule, {
      valid: [
        'it(\'foo\', () => {})',
        `switch (true) {
					case true: {}
				  }`,
        `describe('foo', () => {
					switch('bar') {}
				  })`,
        `const values = something.map(thing => {
					switch (thing.isFoo) {
					  case true:
						return thing.foo;
					  default:
						return thing.bar;
					}
				  });
			
				  it('valid', () => {
					expect(values).toStrictEqual(['foo']);
				  });`
      ],
      invalid: [
        {
          code: `it('is invalid', () => {
						const values = something.map(thing => {
						  switch (thing.isFoo) {
							case true:
							  return thing.foo;
							default:
							  return thing.bar;
						  }
						});
			  
						expect(values).toStrictEqual(['foo']);
					  });`,
          errors: [
            {
              messageId: 'noConditionalTests',
              column: 9,
              line: 3
            }
          ]
        },
        {
          code: `it('foo', () => {
						switch (true) {
						  case true: {}
						}
					  })`,
          errors: [
            {
              messageId: 'noConditionalTests',
              column: 7,
              line: 2
            }
          ]
        },
        {
          code: `describe('foo', () => {
						it('bar', () => {
						  switch('bar') {}
						})
						it('baz', () => {
						  switch('qux') {}
						  switch('quux') {}
						})
					  })`,
          errors: [
            {
              messageId: 'noConditionalTests',
              column: 9,
              line: 3
            },
            {
              messageId: 'noConditionalTests',
              column: 9,
              line: 6
            },
            {
              messageId: 'noConditionalTests',
              column: 9,
              line: 7
            }
          ]
        },
        {
          code: `describe('valid', () => {
						describe('still valid', () => {
						  it('is not valid', () => {
							const values = something.map((thing) => {
							  switch (thing.isFoo) {
								case true:
								  return thing.foo;
								default:
								  return thing.bar;
							  }
							});
				
							switch('invalid') {
							  case true:
								expect(values).toStrictEqual(['foo']);
							}
						  });
						});
					  });`,
          errors: [
            {
              messageId: 'noConditionalTests',
              column: 10,
              line: 5
            },
            {
              messageId: 'noConditionalTests',
              column: 8,
              line: 13
            }
          ]
        }
      ]
    })
  })

  it('if statements', () => {
    ruleTester.run(`${RULE_NAME}-if statements`, rule, {
      valid: [
        'if (foo) {}',
        'it(\'foo\', () => {})',
        'it("foo", function () {})',
        'it(\'foo\', () => {}); function myTest() { if (\'bar\') {} }',
        `describe.each\`\`('foo', () => {
					afterEach(() => {
					  if ('bar') {}
					});
				  })`,
        `const values = something.map((thing) => {
					if (thing.isFoo) {
					  return thing.foo
					} else {
					  return thing.bar;
					}
				  });
			
				  describe('valid', () => {
					it('still valid', () => {
					  expect(values).toStrictEqual(['foo']);
					});
				  });`
      ],
      invalid: [
        {
          code: `it('foo', () => {
						const foo = function(bar) {
						  if (bar) {
							return 1;
						  } else {
							return 2;
						  }
						};
					  });`,
          errors: [
            {
              messageId: 'noConditionalTests',
              column: 9,
              line: 3
            }
          ]
        },
        {
          code: ` describe('foo', () => {
						it('bar', () => {
						  if ('bar') {}
						})
						it('baz', () => {
						  if ('qux') {}
						  if ('quux') {}
						})
					  })`,
          errors: [
            { messageId: 'noConditionalTests', column: 9, line: 3 },
            { messageId: 'noConditionalTests', column: 9, line: 6 },
            { messageId: 'noConditionalTests', column: 9, line: 7 }
          ]
        },
        {
          code: `test("shows error", () => {
						if (1 === 2) {
						  expect(true).toBe(false);
						}
					  });
			  
					  test("does not show error", () => {
						setTimeout(() => console.log("noop"));
						if (1 === 2) {
						  expect(true).toBe(false);
						}
					  });`,
          errors: [
            { messageId: 'noConditionalTests', column: 7, line: 2 },
            { messageId: 'noConditionalTests', column: 7, line: 9 }
          ]
        }
      ]
    })
  })
})
