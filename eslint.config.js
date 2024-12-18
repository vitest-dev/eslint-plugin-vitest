import vitest from '@vitest/eslint-plugin'
import stylistic from '@stylistic/eslint-plugin'
import eslintPlugin from 'eslint-plugin-eslint-plugin'
import parser from '@typescript-eslint/parser'

const styleConfigs = stylistic.configs.customize({
  indent: 2,
  quotes: 'single',
  semi: false,
  jsx: true,
  commaDangle: 'never'
})

/** @type {import("eslint").Linter.Config[]} */
export default [
  eslintPlugin.configs['flat/recommended'],
  vitest.configs.recommended,
  vitest.configs.env,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser
    }
  },
  {
    ignores: ['dist/**/*', '**/*.md'],
    plugins: {
      vitest,
      '@stylistic': stylistic
    },
    rules: {
      ...styleConfigs.rules,
      'eslint-plugin/require-meta-docs-description': 'error'
    },
    settings: {
      vitest: {
        typecheck: true
      }
    }
  }
]
