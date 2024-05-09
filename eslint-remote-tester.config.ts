import type { Config } from 'eslint-remote-tester'
import { getPathIgnorePattern, getRepositories } from 'eslint-remote-tester-repositories'

const config: Config = {
  repositories: getRepositories(),
  pathIgnorePattern: getPathIgnorePattern(),
  extensions: ['js', 'jsx', 'ts', 'tsx', 'cts', 'mts'],

  concurrentTasks: 3,
  cache: false,
  logLevel: 'info',

  eslintrc: {
    root: true,
    env: { es6: true },
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: { jsx: true }
    },
    overrides: [
      {
        files: ['*.ts', '*.tsx', '*.mts', '*.cts'],
        parser: '@typescript-eslint/parser'
      }
    ],
    extends: ['plugin:vitest/legacy-all']
  }
}

export default config
