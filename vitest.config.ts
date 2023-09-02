import { defineConfig, configDefaults } from 'vitest/config'
import * as vitest from 'vitest'
import { RuleTester } from '@typescript-eslint/rule-tester'

RuleTester.afterAll = vitest.afterAll
RuleTester.it = vitest.it
RuleTester.describe = vitest.describe

export default defineConfig({
	test: {
		globals: true,
		include: ['tests/*.test.ts'],
		exclude: [...configDefaults.exclude]
	}
})
