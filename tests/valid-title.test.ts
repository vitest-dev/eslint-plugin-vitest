import rule, { RULE_NAME } from '../src/rules/valid-title'
import { RuleTester } from '@typescript-eslint/rule-tester'

export const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: `${import.meta.dirname}/fixture`,
      project: `./tsconfig.json`
    }
  }
})

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'describe("the correct way to properly handle all the things", () => {});',
    'test("that all is as it should be", () => {});',
    {
      code: 'it("correctly sets the value", () => {});',
      options: [
        {
          ignoreTypeOfDescribeName: false,
          disallowedWords: ['incorrectly']
        }
      ]
    },
    {
      code: 'it("correctly sets the value", () => {});',
      options: [{ disallowedWords: undefined }]
    },
    {
      code: `
      function foo(){}
      describe(foo, () => {
        test('item', () => {
          expect(0).toBe(0)
        })
      })
     `,
      settings: { vitest: { typecheck: true } }
    },
    {
      code: `
      declare const outerName: string;
      describe(outerName, () => {
        test('item', () => {
          expect(0).toBe(0)
        })
      })
     `,
      settings: { vitest: { typecheck: true } }
    },
    {
      code: `
      declare const outerName: 'a';
      describe(outerName, () => {
        test('item', () => {
          expect(0).toBe(0)
        })
      })
     `,
      settings: { vitest: { typecheck: true } }
    },
    {
      code: `
      declare const outerName: \`\${'a'}\`;
      describe(outerName, () => {
        test('item', () => {
          expect(0).toBe(0)
        })
      })
     `,
      settings: { vitest: { typecheck: true } }
    },
    {
      code: `
      class foo{}
      describe(foo, () => {
        test('item', () => {
          expect(0).toBe(0)
        })
      })
      `,
      settings: { vitest: { typecheck: true } }
    }
  ],
  invalid: [
    {
      code: 'test("the correct way to properly handle all things", () => {});',
      options: [{ disallowedWords: ['correct', 'properly', 'all'] }],
      errors: [
        {
          messageId: 'disallowedWord',
          data: { word: 'correct' },
          column: 6,
          line: 1
        }
      ]
    },
    {
      code: 'describe("the correct way to do things", function () {})',
      options: [{ disallowedWords: ['correct'] }],
      errors: [
        {
          messageId: 'disallowedWord',
          data: { word: 'correct' },
          column: 10,
          line: 1
        }
      ]
    },
    {
      code: 'it("has ALL the things", () => {})',
      options: [{ disallowedWords: ['all'] }],
      errors: [
        {
          messageId: 'disallowedWord',
          data: { word: 'ALL' },
          column: 4,
          line: 1
        }
      ]
    },
    {
      code: 'xdescribe("every single one of them", function () {})',
      options: [{ disallowedWords: ['every'] }],
      errors: [
        {
          messageId: 'disallowedWord',
          data: { word: 'every' },
          column: 11,
          line: 1
        }
      ]
    },
    {
      code: 'describe(\'Very Descriptive Title Goes Here\', function () {})',
      options: [{ disallowedWords: ['descriptive'] }],
      errors: [
        {
          messageId: 'disallowedWord',
          data: { word: 'Descriptive' },
          column: 10,
          line: 1
        }
      ]
    },
    {
      code: 'test(`that the value is set properly`, function () {})',
      options: [{ disallowedWords: ['properly'] }],
      errors: [
        {
          messageId: 'disallowedWord',
          data: { word: 'properly' },
          column: 6,
          line: 1
        }
      ]
    }
  ]
})

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      code: 'it(foo, () => {});',
      options: [
        {
          allowArguments: true
        }
      ]
    },
    {
      code: 'describe(bar, () => {});',
      options: [
        {
          allowArguments: true
        }
      ]
    },
    {
      code: 'test(baz, () => {});',
      options: [
        {
          allowArguments: true
        }
      ]
    }
  ],
  invalid: [
    {
      code: 'test(bar, () => {});',
      options: [{ allowArguments: false }],
      errors: [
        {
          messageId: 'titleMustBeString',
          data: { word: 'correct' },
          column: 6,
          line: 1
        }
      ]
    }
  ]
})

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'describe("the correct way to properly handle all the things", () => {});',
    'test("that all is as it should be", () => {});',
    {
      code: 'it("correctly sets the value", () => {});',
      options: [{ mustMatch: {} }]
    },
    {
      code: 'it("correctly sets the value", () => {});',
      options: [{ mustMatch: / /u.source }]
    },
    {
      code: 'it("correctly sets the value", () => {});',
      options: [{ mustMatch: [/ /u.source] }]
    },
    {
      code: 'it("correctly sets the value #unit", () => {});',
      options: [{ mustMatch: /#(?:unit|integration|e2e)/u.source }]
    },
    {
      code: 'it("correctly sets the value", () => {});',
      options: [{ mustMatch: /^[^#]+$|(?:#(?:unit|e2e))/u.source }]
    },
    {
      code: 'it("correctly sets the value", () => {});',
      options: [{ mustMatch: { test: /#(?:unit|integration|e2e)/u.source } }]
    },
    {
      code: `describe('things to test', () => {
      describe('unit tests #unit', () => {
        it('is true', () => {
       expect(true).toBe(true);
        });
      });

      describe('e2e tests #e2e', () => {
        it('is another test #jest4life', () => {});
      });
       });`,
      options: [{ mustMatch: { test: /^[^#]+$|(?:#(?:unit|e2e))/u.source } }]
    }
  ],
  invalid: [
    {
      code: `
     describe('things to test', () => {
      describe('unit tests #unit', () => {
        it('is true', () => {
       expect(true).toBe(true);
        });
      });

      describe('e2e tests #e4e', () => {
        it('is another test #e2e #vitest4life', () => {});
      });
       });`,
      options: [
        {
          mustNotMatch: /(?:#(?!unit|e2e))\w+/u.source,
          mustMatch: /^[^#]+$|(?:#(?:unit|e2e))/u.source
        }
      ],
      errors: [
        {
          messageId: 'mustNotMatch',
          data: {
            functionName: 'describe',
            pattern: /(?:#(?!unit|e2e))\w+/u
          },
          column: 16,
          line: 9
        },
        {
          messageId: 'mustNotMatch',
          data: {
            functionName: 'it',
            pattern: /(?:#(?!unit|e2e))\w+/u
          },
          column: 12,
          line: 10
        }
      ]
    },
    {
      code: ` describe('things to test', () => {
      describe('unit tests #unit', () => {
        it('is true', () => {
       expect(true).toBe(true);
        });
      });

      describe('e2e tests #e4e', () => {
        it('is another test #e2e #vitest4life', () => {});
      });
       });`,
      options: [
        {
          mustNotMatch: [
            /(?:#(?!unit|e2e))\w+/u.source,
            'Please include "#unit" or "#e2e" in titles'
          ],
          mustMatch: [
            /^[^#]+$|(?:#(?:unit|e2e))/u.source,
            'Please include "#unit" or "#e2e" in titles'
          ]
        }
      ],
      errors: [
        {
          messageId: 'mustNotMatchCustom',
          data: {
            functionName: 'describe',
            pattern: /(?:#(?!unit|e2e))\w+/u,
            message: 'Please include "#unit" or "#e2e" in titles'
          },
          column: 16,
          line: 8
        },
        {
          messageId: 'mustNotMatchCustom',
          data: {
            functionName: 'it',
            pattern: /(?:#(?!unit|e2e))\w+/u,
            message: 'Please include "#unit" or "#e2e" in titles'
          },
          column: 12,
          line: 9
        }
      ]
    },
    {
      code: 'test("the correct way to properly handle all things", () => {});',
      options: [{ mustMatch: /#(?:unit|integration|e2e)/u.source }],
      errors: [
        {
          messageId: 'mustMatch',
          data: {
            functionName: 'test',
            pattern: /#(?:unit|integration|e2e)/u
          },
          column: 6,
          line: 1
        }
      ]
    },
    {
      code: 'describe.skip("the test", () => {});',
      options: [
        { mustMatch: { describe: /#(?:unit|integration|e2e)/u.source } }
      ],
      errors: [
        {
          messageId: 'mustMatch',
          data: {
            functionName: 'describe',
            pattern: /#(?:unit|integration|e2e)/u
          },
          column: 15,
          line: 1
        }
      ]
    }
  ]
})

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'it("is a string", () => {});',
    'it("is" + " a " + " string", () => {});',
    'it(1 + " + " + 1, () => {});',
    'test("is a string", () => {});',
    'xtest("is a string", () => {});',
    'xtest(`${myFunc} is a string`, () => {});',
    'describe("is a string", () => {});',
    'describe.skip("is a string", () => {});',
    'describe.skip(`${myFunc} is a string`, () => {});',
    'fdescribe("is a string", () => {});',
    {
      code: 'describe(String(/.+/), () => {});',
      options: [{ ignoreTypeOfDescribeName: true }]
    },
    {
      code: 'describe(myFunction, () => {});',
      options: [{ ignoreTypeOfDescribeName: true }]
    },
    {
      code: 'xdescribe(skipFunction, () => {});',
      options: [{ ignoreTypeOfDescribeName: true, disallowedWords: [] }]
    }
  ],
  invalid: [
    {
      code: 'it.each([])(1, () => {});',
      errors: [
        {
          messageId: 'titleMustBeString',
          column: 13,
          line: 1
        }
      ]
    },
    {
      code: 'it.skip.each([])(1, () => {});',
      errors: [
        {
          messageId: 'titleMustBeString',
          column: 18,
          line: 1
        }
      ]
    },
    {
      code: 'it.skip.each``(1, () => {});',
      errors: [
        {
          messageId: 'titleMustBeString',
          column: 16,
          line: 1
        }
      ]
    },
    {
      code: 'it(123, () => {});',
      errors: [
        {
          messageId: 'titleMustBeString',
          column: 4,
          line: 1
        }
      ]
    },
    {
      code: 'it.concurrent(123, () => {});',
      errors: [
        {
          messageId: 'titleMustBeString',
          column: 15,
          line: 1
        }
      ]
    },
    {
      code: 'it(1 + 2 + 3, () => {});',
      errors: [
        {
          messageId: 'titleMustBeString',
          column: 4,
          line: 1
        }
      ]
    }
  ]
})

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'describe()',
    'someFn("", function () {})',
    'describe("foo", function () {})',
    'describe("foo", function () { it("bar", function () {}) })',
    'test("foo", function () {})',
    'test.concurrent("foo", function () {})',
    'test(`foo`, function () {})',
    'test.concurrent(`foo`, function () {})',
    'test(`${foo}`, function () {})',
    'test.concurrent(`${foo}`, function () {})',
    'it(\'foo\', function () {})',
    'it.each([])()',
    'it.concurrent(\'foo\', function () {})',
    'xdescribe(\'foo\', function () {})',
    'xit(\'foo\', function () {})',
    'xtest(\'foo\', function () {})'
  ],
  invalid: [
    {
      code: 'describe("", function () {})',
      errors: [
        {
          messageId: 'emptyTitle',
          column: 1,
          line: 1,
          data: { functionName: 'describe' }
        }
      ]
    },
    {
      code: `
       describe('foo', () => {
      it('', () => {});
       });
     `,
      errors: [
        {
          messageId: 'emptyTitle',
          column: 7,
          line: 3,
          data: { functionName: 'test' }
        }
      ]
    },
    {
      code: 'it("", function () {})',
      errors: [
        {
          messageId: 'emptyTitle',
          column: 1,
          line: 1,
          data: { functionName: 'test' }
        }
      ]
    },
    {
      code: 'it("", function () {})',
      settings: { vitest: { typecheck: true } },
      errors: [
        {
          messageId: 'emptyTitle',
          column: 1,
          line: 1,
          data: { functionName: 'test' }
        }
      ]
    },
    {
      code: 'it.concurrent("", function () {})',
      errors: [
        {
          messageId: 'emptyTitle',
          column: 1,
          line: 1,
          data: { functionName: 'test' }
        }
      ]
    },
    {
      code: 'test("", function () {})',
      errors: [
        {
          messageId: 'emptyTitle',
          column: 1,
          line: 1,
          data: { functionName: 'test' }
        }
      ]
    },
    {
      code: 'test.concurrent("", function () {})',
      errors: [
        {
          messageId: 'emptyTitle',
          column: 1,
          line: 1,
          data: { functionName: 'test' }
        }
      ]
    },
    {
      code: 'test.concurrent(``, function () {})',
      errors: [
        {
          messageId: 'emptyTitle',
          column: 1,
          line: 1,
          data: { functionName: 'test' }
        }
      ]
    },
    {
      code: 'xdescribe(\'\', () => {})',
      errors: [
        {
          messageId: 'emptyTitle',
          column: 1,
          line: 1,
          data: { functionName: 'describe' }
        }
      ]
    }
  ]
})

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'it()',
    'it.concurrent()',
    'describe()',
    'it.each()()',
    'describe("foo", function () {})',
    'fdescribe("foo", function () {})',
    'xdescribe("foo", function () {})',
    'it("foo", function () {})',
    'it.concurrent("foo", function () {})',
    'fit("foo", function () {})',
    'fit.concurrent("foo", function () {})',
    'xit("foo", function () {})',
    'test("foo", function () {})',
    'test.concurrent("foo", function () {})',
    'xtest("foo", function () {})',
    'xtest(`foo`, function () {})',
    'someFn("foo", function () {})',
    `export const myTest = test.extend({
      archive: []
    })`
  ],
  invalid: [
    {
      code: 'describe(" foo", function () {})',
      output: 'describe("foo", function () {})',
      errors: [{ messageId: 'accidentalSpace', column: 10, line: 1 }]
    },
    {
      code: 'describe.each()(" foo", function () {})',
      output: 'describe.each()("foo", function () {})',
      errors: [{ messageId: 'accidentalSpace', column: 17, line: 1 }]
    },
    {
      code: 'describe.only.each()(" foo", function () {})',
      output: 'describe.only.each()("foo", function () {})',
      errors: [{ messageId: 'accidentalSpace', column: 22, line: 1 }]
    },
    {
      code: 'describe(" foo foe fum", function () {})',
      output: 'describe("foo foe fum", function () {})',
      errors: [{ messageId: 'accidentalSpace', column: 10, line: 1 }]
    },
    {
      code: 'describe("foo foe fum ", function () {})',
      output: 'describe("foo foe fum", function () {})',
      errors: [{ messageId: 'accidentalSpace', column: 10, line: 1 }]
    },
    {
      code: 'it.skip(" foo", function () {})',
      output: 'it.skip("foo", function () {})',
      errors: [{ messageId: 'accidentalSpace', column: 9, line: 1 }]
    },
    {
      code: 'fit("foo ", function () {})',
      output: 'fit("foo", function () {})',
      errors: [{ messageId: 'accidentalSpace', column: 5, line: 1 }]
    },
    {
      code: 'it.skip("foo ", function () {})',
      output: 'it.skip("foo", function () {})',
      errors: [{ messageId: 'accidentalSpace', column: 9, line: 1 }]
    }
  ]
})

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      code: 'const localTest = test.extend({})',
      name: 'does not error when using test.extend'
    },
    {
      code: `import { it } from 'vitest'

const test = it.extend({
  fixture: [
    async ({}, use) => {
      setup()
      await use()
      teardown()
    },
    { auto: true }
  ],
})

test('', () => {})`,
      name: 'does not error when using it.extend'
    }
  ],

  invalid: []
})
