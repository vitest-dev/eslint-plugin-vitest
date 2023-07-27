import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['tests/*.test.ts'],
		exclude: [...configDefaults.exclude]
	}
})
