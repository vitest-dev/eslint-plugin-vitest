import vitest from 'eslint-plugin-vitest'

export default [
  {
    files: ['tests/**'], // or any other pattern
    plugins: {
      vitest
    },
    rules: {
      ...vitest.configs.recommended.rules
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals
      }
    }
  }
]
