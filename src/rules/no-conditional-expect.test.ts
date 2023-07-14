import { describe, it } from 'vitest'
import { ruleTester } from '../utils/test'
import rule, { RULE_NAME } from './no-conditional-expect'

describe(RULE_NAME, () => {
  it(RULE_NAME, () => {
    ruleTester.run(`${RULE_NAME}-common tests`, rule, {
      valid: [
        `
				it('foo', () => {
				  expect(1).toBe(2);
				});
			  `,
        `
				it('foo', () => {
				  expect(!true).toBe(false);
				});
			  `
      ],
      invalid: []
    })

    ruleTester.run(`${RULE_NAME}-logical conditions`, rule, {
      valid: [
        `it('foo', () => {
					process.env.FAIL && setNum(1);
			
					expect(num).toBe(2);
				  });`,
        `
				  function getValue() {
					let num = 2;
			
					process.env.FAIL && setNum(1);
			
					return num;
				  }
			
				  it('foo', () => {
					expect(getValue()).toBe(2);
				  });
				`,
        `
				function getValue() {
				  let num = 2;
		  
				  process.env.FAIL || setNum(1);
		  
				  return num;
				}
		  
				it('foo', () => {
				  expect(getValue()).toBe(2);
				});
			  `
      ],
      invalid: [
        {
          code: ` it('foo', () => {
						something && expect(something).toHaveBeenCalled();
					  })`,
          errors: [
            {
              messageId: 'noConditionalExpect'
            }
          ]
        },
        {
          code: ` it('foo', () => {
						a || (b && expect(something).toHaveBeenCalled());
					  })`,
          errors: [
            {
              messageId: 'noConditionalExpect'
            }
          ]
        },
        {
          code: `
					  it.each\`\`('foo', () => {
						something || expect(something).toHaveBeenCalled();
					  })
					`,
          errors: [{ messageId: 'noConditionalExpect' }]
        },
        {
          code: `
					  it.each()('foo', () => {
						something || expect(something).toHaveBeenCalled();
					  })
					`,
          errors: [{ messageId: 'noConditionalExpect' }]
        },
        {
          code: `
					  function getValue() {
						something || expect(something).toHaveBeenCalled(); 
					  }
			  
					  it('foo', getValue);
					`,
          errors: [{ messageId: 'noConditionalExpect' }]
        }
      ]
    })

    ruleTester.run(`${RULE_NAME}-conditional conditions`, rule, {
      valid: [
        `
      it('foo', () => {
        const num = process.env.FAIL ? 1 : 2;

        expect(num).toBe(2);
      });
    `,
        `
      function getValue() {
        return process.env.FAIL ? 1 : 2
      }

      it('foo', () => {
        expect(getValue()).toBe(2);
      });
    `
      ],
      invalid: [
        {
          code: `
					  it('foo', () => {
						something ? expect(something).toHaveBeenCalled() : noop();
					  })
					`,
          errors: [{ messageId: 'noConditionalExpect' }]
        },
        {
          code: `
					  function getValue() {
						something ? expect(something).toHaveBeenCalled() : noop();
					  }
			  
					  it('foo', getValue);
					`,
          errors: [{ messageId: 'noConditionalExpect' }]
        },
        {
          code: `
					  it('foo', () => {
						something ? noop() : expect(something).toHaveBeenCalled();
					  })
					`,
          errors: [{ messageId: 'noConditionalExpect' }]
        }
      ]
    })
  })
})
