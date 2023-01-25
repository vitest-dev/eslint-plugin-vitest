import lowerCaseTitle, { RULE_NAME as lowerCaseTitleName } from './rules/prefer-lowercase-title'
import maxNestedDescribe, { RULE_NAME as maxNestedDescribeName } from './rules/max-nested-describe'
import noIdenticalTitle, { RULE_NAME as noIdenticalTitleName } from './rules/no-identical-title'
import noSkippedTests, { RULE_NAME as noSkippedTestsName } from './rules/no-skipped-tests'
import noFocusedTests, { RULE_NAME as noFocusedTestsName } from './rules/no-focused-tests'
import noConditionalTest, { RULE_NAME as noConditionalTests } from './rules/no-conditional-tests'
import expectExpect, { RULE_NAME as expectedExpect } from './rules/expect-expect'
import consistentTestIt, { RULE_NAME as useConsistentTestIt } from './rules/consistent-test-it'
import preferToBe, { RULE_NAME as usePreferTobe } from './rules/prefer-to-be'

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
		[usePreferTobe]: preferToBe
	}
}
