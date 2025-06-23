import vitest from '@vitest/eslint-plugin'
import eslintPlugin from 'eslint-plugin-eslint-plugin'
import parser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

/** @type {import("eslint").Linter.Config[]} */
export default [
  eslintPlugin.configs['flat/recommended'],
  vitest.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
    },
  },
  {
    files: ['**/*.test.*'],
    plugins: {
      vitest,
    },
    rules: {
      'eslint-plugin/require-meta-docs-description': 'error',
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
  },
]
