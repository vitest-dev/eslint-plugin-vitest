import { RuleTester } from '@typescript-eslint/utils/dist/ts-eslint'
import { it } from 'vitest'
import rule, { RULE_NAME } from './max-nested-describe'

const valids = [
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

const invalids = [
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
    const ruleTester: RuleTester = new RuleTester({
        parser: require.resolve('@typescript-eslint/parser')
    })
    ruleTester.run(RULE_NAME, rule, {
        valid: valids,
        invalid: invalids.map((i) => ({
            code: i,
            output: i,
            errors: [{ messageId: 'maxNestedDescribe' }]
        }))
    })
})
