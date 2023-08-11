import { it } from 'vitest'
import rule, { RULE_NAME } from '../src/rules/max-nested-describe'
import { ruleTester } from './ruleTester'

const valid = [
	`describe('another suite', () => {
 describe('another suite', () => {
   it('skipped test', () => {
      // Test skipped, as tests are running in Only mode
      assert.equal(Math.sqrt(4), 3)
    })

    it.only('test', () => {
      // Only this test (and others marked with only) are run
      assert.equal(Math.sqrt(4), 2)
    })
  })
})`,
	`describe('another suite', () => {
 describe('another suite', () => {
    describe('another suite', () => {
       describe('another suite', () => {
    
      })
    })
  })
})`
]

const invalid = [
	`describe('another suite', () => {
 describe('another suite', () => {
    describe('another suite', () => {
       describe('another suite', () => {
          describe('another suite', () => {
          describe('another suite', () => {
    
          })
       })
      })
    })
  })
})`,
	`describe('another suite', () => {
 describe('another suite', () => {
    describe('another suite', () => {
       describe('another suite', () => {
          describe('another suite', () => {
          describe('another suite', () => {
             it('skipped test', () => {
              // Test skipped, as tests are running in Only mode
              assert.equal(Math.sqrt(4), 3)
            })

            it.only('test', () => {
              // Only this test (and others marked with only) are run
              assert.equal(Math.sqrt(4), 2)
            })
          })
       })
      })
    })
  })
}) `
]

it('max-nested-describe', () => {
	ruleTester.run(RULE_NAME, rule, {
		valid,
		invalid: invalid.map((i) => ({
			code: i,
			output: i,
			errors: [{ messageId: 'maxNestedDescribe' }]
		}))
	})
})
