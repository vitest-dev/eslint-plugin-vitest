import parser from '@typescript-eslint/parser'
import type { Config } from 'eslint-remote-tester'
import {
  getPathIgnorePattern,
  getRepositories,
} from 'eslint-remote-tester-repositories'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore available once package is built
import vitest from '@vitest/eslint-plugin'

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
  ] as Config['eslintConfig'],
} satisfies Config
