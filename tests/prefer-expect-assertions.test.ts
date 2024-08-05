import rule, { RULE_NAME } from '../src/rules/prefer-expect-assertions'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'test("it1", () => {expect.assertions(0);})',
    'test("it1", function() {expect.assertions(0);})',
    'test("it1", function() {expect.hasAssertions();})',
    'it("it1", function() {expect.assertions(0);})',
    'test("it1")',
    'itHappensToStartWithIt("foo", function() {})',
    'testSomething("bar", function() {})',
    'it(async () => {expect.assertions(0);})',
    `test("example-fail", async ({ expect }) => {
    expect.assertions(1);
    await expect(Promise.resolve(null)).resolves.toBeNull();
  });
    `,
    {
      code: `
   const expectNumbersToBeGreaterThan = (numbers, value) => {
    for (let number of numbers) {
    expect(number).toBeGreaterThan(value);
   }
   };
 
   it('returns numbers that are greater than two', function () {
    expectNumbersToBeGreaterThan(getNumbers(), 2);
   });
   `,
      options: [{ onlyFunctionsWithExpectInLoop: true }]
    },
    {
      code: `
   it("returns numbers that are greater than five", function () {
    expect.assertions(2);
    for (const number of getNumbers()) {
    expect(number).toBeGreaterThan(5);
   }
   });
   `,
      options: [{ onlyFunctionsWithExpectInLoop: true }]
    },
    {
      code: `it("returns things that are less than ten", function () {
    expect.hasAssertions();
    for (const thing in things) {
     expect(thing).toBeLessThan(10);
    }
   });`,
      options: [{ onlyFunctionsWithExpectInLoop: true }]
    }
  ],
  invalid: [
    {
      code: 'it("it1", () => foo())',
      errors: [
        {
          messageId: 'haveExpectAssertions',
          column: 1,
          line: 1,
          suggestions: null
        }
      ]
    },
    {
      code: 'it(\'resolves\', () => expect(staged()).toBe(true));',
      errors: [
        {
          messageId: 'haveExpectAssertions',
          column: 1,
          line: 1,
          suggestions: null
        }
      ]
    },
    {
      code: 'it(\'resolves\', async () => expect(await staged()).toBe(true));',
      errors: [
        {
          messageId: 'haveExpectAssertions',
          column: 1,
          line: 1,
          suggestions: null
        }
      ]
    },
    {
      code: 'it("it1", () => {})',
      errors: [
        {
          messageId: 'haveExpectAssertions',
          column: 1,
          line: 1,
          suggestions: [
            {
              messageId: 'suggestAddingHasAssertions',
              output: 'it("it1", () => {expect.hasAssertions();})'
            },
            {
              messageId: 'suggestAddingAssertions',
              output: 'it("it1", () => {expect.assertions();})'
            }
          ]
        }
      ]
    },
    {
      code: 'it("it1", () => { foo()})',
      errors: [
        {
          messageId: 'haveExpectAssertions',
          column: 1,
          line: 1,
          suggestions: [
            {
              messageId: 'suggestAddingHasAssertions',
              output: 'it("it1", () => {expect.hasAssertions(); foo()})'
            },
            {
              messageId: 'suggestAddingAssertions',
              output: 'it("it1", () => {expect.assertions(); foo()})'
            }
          ]
        }
      ]
    },
    {
      code: 'it("it1", function() {var a = 2;})',
      errors: [
        {
          messageId: 'haveExpectAssertions',
          column: 1,
          line: 1,
          suggestions: [
            {
              messageId: 'suggestAddingHasAssertions',
              output:
                'it("it1", function() {expect.hasAssertions();var a = 2;})'
            },
            {
              messageId: 'suggestAddingAssertions',
              output: 'it("it1", function() {expect.assertions();var a = 2;})'
            }
          ]
        }
      ]
    },
    {
      code: 'it("it1", function() {expect.assertions();})',
      errors: [
        {
          messageId: 'assertionsRequiresOneArgument',
          column: 30,
          line: 1,
          suggestions: []
        }
      ]
    },
    {
      code: 'it("it1", function() {expect.assertions(1,2);})',
      errors: [
        {
          messageId: 'assertionsRequiresOneArgument',
          column: 43,
          line: 1,
          suggestions: [
            {
              messageId: 'suggestRemovingExtraArguments',
              output: 'it("it1", function() {expect.assertions(1,);})'
            }
          ]
        }
      ]
    },
    {
      code: 'it("it1", function() {expect.assertions(1,2,);})',
      errors: [
        {
          messageId: 'assertionsRequiresOneArgument',
          column: 43,
          line: 1,
          suggestions: [
            {
              messageId: 'suggestRemovingExtraArguments',
              output: 'it("it1", function() {expect.assertions(1,);})'
            }
          ]
        }
      ]
    },
    {
      code: 'it("it1", function() {expect.assertions("1");})',
      errors: [
        {
          messageId: 'assertionsRequiresNumberArgument',
          column: 41,
          line: 1,
          suggestions: []
        }
      ]
    },
    {
      code: 'it("it1", function() {expect.hasAssertions("1");})',
      errors: [
        {
          messageId: 'hasAssertionsTakesNoArguments',
          column: 30,
          line: 1,
          suggestions: [
            {
              messageId: 'suggestRemovingExtraArguments',
              output: 'it("it1", function() {expect.hasAssertions();})'
            }
          ]
        }
      ]
    },
    {
      code: 'it("it1", function() {expect.hasAssertions("1",);})',
      errors: [
        {
          messageId: 'hasAssertionsTakesNoArguments',
          column: 30,
          line: 1,
          suggestions: [
            {
              messageId: 'suggestRemovingExtraArguments',
              output: 'it("it1", function() {expect.hasAssertions();})'
            }
          ]
        }
      ]
    },
    {
      code: 'it("it1", function() {expect.hasAssertions("1", "2");})',
      errors: [
        {
          messageId: 'hasAssertionsTakesNoArguments',
          column: 30,
          line: 1,
          suggestions: [
            {
              messageId: 'suggestRemovingExtraArguments',
              output: 'it("it1", function() {expect.hasAssertions();})'
            }
          ]
        }
      ]
    },
    {
      code: `it("it1", () => {
    expect.hasAssertions();
   
    for (const number of getNumbers()) {
      expect(number).toBeGreaterThan(0);
    }
     });
   
     it("it1", () => {
    for (const number of getNumbers()) {
      expect(number).toBeGreaterThan(0);
    }
     });`,
      options: [{ onlyFunctionsWithExpectInLoop: true }],
      errors: [
        {
          messageId: 'haveExpectAssertions',
          column: 6,
          line: 9,
          suggestions: [
            {
              messageId: 'suggestAddingHasAssertions',
              output: `it("it1", () => {
    expect.hasAssertions();
   
    for (const number of getNumbers()) {
      expect(number).toBeGreaterThan(0);
    }
     });
   
     it("it1", () => {expect.hasAssertions();
    for (const number of getNumbers()) {
      expect(number).toBeGreaterThan(0);
    }
     });`
            },
            {
              messageId: 'suggestAddingAssertions',
              output: `it("it1", () => {
    expect.hasAssertions();
   
    for (const number of getNumbers()) {
      expect(number).toBeGreaterThan(0);
    }
     });
   
     it("it1", () => {expect.assertions();
    for (const number of getNumbers()) {
      expect(number).toBeGreaterThan(0);
    }
     });`
            }
          ]
        }
      ]
    },
    {
      code: `it("returns numbers that are greater than four", async () => {
     for (const number of await getNumbers()) {
    expect(number).toBeGreaterThan(4);
     }
   });
 
   it("returns numbers that are greater than five", () => {
     for (const number of getNumbers()) {
    expect(number).toBeGreaterThan(5);
     }
   });
    `,
      options: [{ onlyFunctionsWithExpectInLoop: true }],
      errors: [
        {
          messageId: 'haveExpectAssertions',
          column: 1,
          line: 1,
          suggestions: [
            {
              messageId: "suggestAddingHasAssertions",
              output: `it("returns numbers that are greater than four", async () => {expect.hasAssertions();
     for (const number of await getNumbers()) {
    expect(number).toBeGreaterThan(4);
     }
   });
 
   it("returns numbers that are greater than five", () => {
     for (const number of getNumbers()) {
    expect(number).toBeGreaterThan(5);
     }
   });
    `
            },
            {
              messageId: "suggestAddingAssertions",
              output: `it("returns numbers that are greater than four", async () => {expect.assertions();
     for (const number of await getNumbers()) {
    expect(number).toBeGreaterThan(4);
     }
   });
 
   it("returns numbers that are greater than five", () => {
     for (const number of getNumbers()) {
    expect(number).toBeGreaterThan(5);
     }
   });
    `

            }
          ]
        },
        {
          messageId: 'haveExpectAssertions',
          column: 4,
          line: 7,
          suggestions: [
            {
              messageId: "suggestAddingHasAssertions",
              output: `it("returns numbers that are greater than four", async () => {
     for (const number of await getNumbers()) {
    expect(number).toBeGreaterThan(4);
     }
   });
 
   it("returns numbers that are greater than five", () => {expect.hasAssertions();
     for (const number of getNumbers()) {
    expect(number).toBeGreaterThan(5);
     }
   });
    `
            },
            {
              messageId: "suggestAddingAssertions",
              output: `it("returns numbers that are greater than four", async () => {
     for (const number of await getNumbers()) {
    expect(number).toBeGreaterThan(4);
     }
   });
 
   it("returns numbers that are greater than five", () => {expect.assertions();
     for (const number of getNumbers()) {
    expect(number).toBeGreaterThan(5);
     }
   });
    `
            }
          ]
        }
      ]
    }
  ]
})
