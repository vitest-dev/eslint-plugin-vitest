import { describe, it, expect } from 'vitest'

describe('foo', () => {
	it.todo('mdmdms')

	it('foo', () => {
		expect(true).toBeTruthy()
	})

	it('bar', () => {
		const fooBar = { foo: 'bar' }
		expect(fooBar).to.deep.eq({ foo: 'bar' })
	})
})
