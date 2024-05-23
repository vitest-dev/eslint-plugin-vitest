import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		include: ['tests/*.test.ts', 'tests/**/*.test.ts'],
		exclude: [...configDefaults.exclude]
	}
})
