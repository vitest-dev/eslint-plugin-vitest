import { expect, it, describe } from 'vitest'

describe('conditionals', () => {
  it('should run only if condition is true', () => {
    const test_var = true
    if (test_var)
      expect(true).toBeTruthy()
  })

  it('should error one errors only', () => {
    expect(true).toBeTruthy()
  })
})
