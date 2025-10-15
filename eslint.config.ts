import { defineConfig } from 'eslint/config'
import vitest from './src/index.js'
import eslintPlugin from 'eslint-plugin-eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import tseslint from 'typescript-eslint'

export default defineConfig(
  eslintPlugin.configs.recommended,
  vitest.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            'eslint.config.ts',
            '.eslint-doc-generatorrc.js',
            'vitest.config.mts',
            'unbuild.config.ts',
            'eslint-remote-tester.config.ts',
            'scripts/chain-permutations.ts',
          ],
        },
        tsconfigRootDir: import.meta.dirname,
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
  {
    ignores: ['**/dist/**'],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
)
