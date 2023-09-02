import rule, { RULE_NAME } from '../src/rules/prefer-each'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'it("is true", () => { expect(true).toBe(false) });',
    `it.each(getNumbers())("only returns numbers that are greater than seven", number => {
					expect(number).toBeGreaterThan(7);
				  });`,
    `it("returns numbers that are greater than five", function () {
					for (const number of getNumbers()) {
					  expect(number).toBeGreaterThan(5);
					}
				  });`,
    `it("returns things that are less than ten", function () {
					for (const thing in things) {
					  expect(thing).toBeLessThan(10);
					}
				  });`,
    `it("only returns numbers that are greater than seven", function () {
					const numbers = getNumbers();
			
					for (let i = 0; i < numbers.length; i++) {
					  expect(numbers[i]).toBeGreaterThan(7);
					}
				  });`
  ],
  invalid: [
    {
      code: `  for (const [input, expected] of data) {
						it(\`results in $\{expected}\`, () => {
						  expect(fn(input)).toBe(expected)
						});
					  }`,
      errors: [
        {
          data: { fn: 'it' },
          messageId: 'preferEach'
        }
      ]
    },
    {
      code: ` for (const [input, expected] of data) {
						describe(\`when the input is $\{input}\`, () => {
						  it(\`results in $\{expected}\`, () => {
							expect(fn(input)).toBe(expected)
						  });
						});
					  }`,
      errors: [
        {
          data: { fn: 'describe' },
          messageId: 'preferEach'
        }
      ]
    },
    {
      code: `for (const [input, expected] of data) {
						describe(\`when the input is $\{input}\`, () => {
						  it(\`results in $\{expected}\`, () => {
							expect(fn(input)).toBe(expected)
						  });
						});
					  }
			  
					  for (const [input, expected] of data) {
						it.skip(\`results in $\{expected}\`, () => {
						  expect(fn(input)).toBe(expected)
						});
					  }`,
      errors: [
        {
          data: { fn: 'describe' },
          messageId: 'preferEach'
        },
        {
          data: { fn: 'it' },
          messageId: 'preferEach'
        }
      ]
    },
    {
      code: `for (const [input, expected] of data) {
						it.skip(\`results in $\{expected}\`, () => {
						  expect(fn(input)).toBe(expected)
						});
					  }`,
      errors: [
        {
          data: { fn: 'it' },
          messageId: 'preferEach'
        }
      ]
    },
    {
      code: `it('is true', () => {
						expect(true).toBe(false);
					  });
			  
					  for (const [input, expected] of data) {
						it.skip(\`results in $\{expected}\`, () => {
						  expect(fn(input)).toBe(expected)
						});
					  }`,
      errors: [
        {
          data: { fn: 'it' },
          messageId: 'preferEach'
        }
      ]
    },
    {
      code: ` for (const [input, expected] of data) {
						it.skip(\`results in $\{expected}\`, () => {
						  expect(fn(input)).toBe(expected)
						});
					  }
			  
					  it('is true', () => {
						expect(true).toBe(false);
					  });`,
      errors: [
        {
          data: { fn: 'it' },
          messageId: 'preferEach'
        }
      ]
    },
    {
      code: ` it('is true', () => {
						expect(true).toBe(false);
					  });
			  
					  for (const [input, expected] of data) {
						it.skip(\`results in $\{expected}\`, () => {
						  expect(fn(input)).toBe(expected)
						});
					  }
			  
					  it('is true', () => {
						expect(true).toBe(false);
					  });`,
      errors: [
        {
          data: { fn: 'it' },
          messageId: 'preferEach'
        }
      ]
    },
    {
      code: `for (const [input, expected] of data) {
						it(\`results in $\{expected}\`, () => {
						  expect(fn(input)).toBe(expected)
						});
			  
						it(\`results in $\{expected}\`, () => {
						  expect(fn(input)).toBe(expected)
						});
					  }`,
      errors: [
        {
          data: { fn: 'describe' },
          messageId: 'preferEach'
        }
      ]
    },
    {
      code: `for (const [input, expected] of data) {
						it(\`results in $\{expected}\`, () => {
						  expect(fn(input)).toBe(expected)
						});
					  }
			  
					  for (const [input, expected] of data) {
						it(\`results in $\{expected}\`, () => {
						  expect(fn(input)).toBe(expected)
						});
					  }`,
      errors: [
        {
          data: { fn: 'it' },
          messageId: 'preferEach'
        },
        {
          data: { fn: 'it' },
          messageId: 'preferEach'
        }
      ]
    },
    {
      code: `for (const [input, expected] of data) {
						beforeEach(() => setupSomething(input));
			  
						test(\`results in $\{expected}\`, () => {
						  expect(doSomething()).toBe(expected)
						});
					  }`,
      errors: [
        {
          data: { fn: 'describe' },
          messageId: 'preferEach'
        }
      ]
    },
    {
      code: `
					  for (const [input, expected] of data) {
						it("only returns numbers that are greater than seven", function () {
						  const numbers = getNumbers(input);
				
						  for (let i = 0; i < numbers.length; i++) {
							expect(numbers[i]).toBeGreaterThan(7);
						  }
						});
					  }
					`,
      errors: [
        {
          data: { fn: 'it' },
          messageId: 'preferEach'
        }
      ]
    },
    {
      code: `
					  for (const [input, expected] of data) {
						beforeEach(() => setupSomething(input));
			  
						it("only returns numbers that are greater than seven", function () {
						  const numbers = getNumbers();
				
						  for (let i = 0; i < numbers.length; i++) {
							expect(numbers[i]).toBeGreaterThan(7);
						  }
						});
					  }
					`,
      errors: [
        {
          data: { fn: 'describe' },
          messageId: 'preferEach'
        }
      ]
    }
  ]
})
