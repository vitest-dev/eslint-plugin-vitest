import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import gitignore from 'eslint-config-flat-gitignore'
import vitest from './src/index.js'
import eslintPlugin from 'eslint-plugin-eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default defineConfig(
  gitignore(),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  vitest.configs.recommended,
  eslintPlugin.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.js'],
        },
      },
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      // Demoted to warnings so these can be addressed gradually
      'eslint-plugin/require-meta-default-options': 'warn',
      'eslint-plugin/require-meta-schema-description': 'warn',
      'eslint-plugin/no-meta-schema-default': 'warn',
      'no-unsafe-optional-chaining': 'warn',
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
  eslintConfigPrettier,
)
