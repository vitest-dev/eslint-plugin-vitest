import vitest from "eslint-plugin-vitest"

export default {
  repositories: ['AriPerkkio/eslint-remote-tester-integration-test-target'],
  extensions: ['ts', 'tsx', 'cts', 'mts'],
  concurrentTasks: 3,
  cache: false,
  logLevel: 'info',
  eslintConfig: [vitest.configs.all]
}
