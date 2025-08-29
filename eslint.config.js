import vitest from '@vitest/eslint-plugin'
import eslintPlugin from 'eslint-plugin-eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslintPlugin.configs['flat/recommended'],
  vitest.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            'eslint.config.js',
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
