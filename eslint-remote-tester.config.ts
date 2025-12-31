import parser from '@typescript-eslint/parser'
import type { Config } from 'eslint-remote-tester'
import {
  getPathIgnorePattern,
  getRepositories,
} from 'eslint-remote-tester-repositories'
import vitest from './src'

export default {
  repositories: getRepositories(),
  pathIgnorePattern: getPathIgnorePattern(),
  extensions: ['ts', 'tsx', 'cts', 'mts'],
  concurrentTasks: 3,
  cache: false,
  logLevel: 'info',
  eslintConfig: [
    vitest.configs.all,
    {
      languageOptions: {
        parser,
      },
    },
  ],
} satisfies Config
