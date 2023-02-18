import lowerCaseTitle, { RULE_NAME as lowerCaseTitleName } from './rules/prefer-lowercase-title'
import maxNestedDescribe, { RULE_NAME as maxNestedDescribeName } from './rules/max-nested-describe'
import noIdenticalTitle, { RULE_NAME as noIdenticalTitleName } from './rules/no-identical-title'
import noSkippedTests, { RULE_NAME as noSkippedTestsName } from './rules/no-skipped-tests'
import noFocusedTests, { RULE_NAME as noFocusedTestsName } from './rules/no-focused-tests'
import noConditionalTest, { RULE_NAME as noConditionalTests } from './rules/no-conditional-tests'
import expectExpect, { RULE_NAME as expectedExpect } from './rules/expect-expect'
import consistentTestIt, { RULE_NAME as useConsistentTestIt } from './rules/consistent-test-it'
import preferToBe, { RULE_NAME as usePreferTobe } from './rules/prefer-to-be'
import noHooks, { RULE_NAME as noHooksName } from './rules/no-hooks'

const createConfig = (rules: Record<string, string>) => ({
	plugins: ['vitest'],
	rules: Object.keys(rules).reduce((acc, ruleName) => {
		return {
			...acc,
			[`vitest/${ruleName}`]: rules[ruleName]
		}
	}, {})
})

const allRules = {
	[noSkippedTestsName]: 'warn',
	[lowerCaseTitleName]: 'warn',
	[maxNestedDescribeName]: 'warn',
	[noFocusedTestsName]: 'warn',
	[noConditionalTests]: 'warn',
	[useConsistentTestIt]: 'warn',
	[noHooksName]: 'warn'
}

const recommended = {
	[expectedExpect]: 'warn',
	[noIdenticalTitleName]: 'warn',
	[usePreferTobe]: 'warn'
}

export default {
	rules: {
		[noSkippedTestsName]: noSkippedTests,
		[lowerCaseTitleName]: lowerCaseTitle,
		[maxNestedDescribeName]: maxNestedDescribe,
		[noIdenticalTitleName]: noIdenticalTitle,
		[noFocusedTestsName]: noFocusedTests,
		[noConditionalTests]: noConditionalTest,
		[expectedExpect]: expectExpect,
		[useConsistentTestIt]: consistentTestIt,
		[usePreferTobe]: preferToBe,
		[noHooksName]: noHooks
	},
	configs: {
		all: createConfig(allRules),
		recommended: createConfig(recommended)
	},
	environments: {
		env: {
			globals: {
				suite: true,
				test: true,
				describe: true,
				it: true,
				expect: true,
				assert: true,
				vitest: true,
				vi: true,
				beforeAll: true,
				afterAll: true,
				beforeEach: true,
				afterEach: true
			}
		}
	}
}
