import { ESLintUtils } from '@typescript-eslint/utils'

export const createEslintRule = ESLintUtils.RuleCreator((ruleName) => `https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/${ruleName}.md`)
