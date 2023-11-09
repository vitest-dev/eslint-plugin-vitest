import lowerCaseTitle, { RULE_NAME as lowerCaseTitleName } from './rules/prefer-lowercase-title'
import maxNestedDescribe, { RULE_NAME as maxNestedDescribeName } from './rules/max-nested-describe'
import noIdenticalTitle, { RULE_NAME as noIdenticalTitleName } from './rules/no-identical-title'
import noFocusedTests, { RULE_NAME as noFocusedTestsName } from './rules/no-focused-tests'
import noConditionalTest, { RULE_NAME as noConditionalTests } from './rules/no-conditional-tests'
import expectExpect, { RULE_NAME as expectedExpect } from './rules/expect-expect'
import consistentTestIt, { RULE_NAME as useConsistentTestIt } from './rules/consistent-test-it'
import preferToBe, { RULE_NAME as usePreferTobe } from './rules/prefer-to-be'
import noHooks, { RULE_NAME as noHooksName } from './rules/no-hooks'
import noRestrictedViMethods, { RULE_NAME as noRestrictedViMethodsName } from './rules/no-restricted-vi-methods'
import consistentTestFilename, { RULE_NAME as useConsistentTestFilename } from './rules/consistent-test-filename'
import maxExpect, { RULE_NAME as maxExpectName } from './rules/max-expects'
import noAliasMethod, { RULE_NAME as noAliasMethodName } from './rules/no-alias-methods'
import noCommentedOutTests, { RULE_NAME as noCommentedOutTestsName } from './rules/no-commented-out-tests'
import noConditonalExpect, { RULE_NAME as noConditonalExpectName } from './rules/no-conditional-expect'
import noConditionalInTest, { RULE_NAME as noConditionalInTestName } from './rules/no-conditional-in-test'
import noDisabledTests, { RULE_NAME as noDisabledTestsName } from './rules/no-disabled-tests'
import noDoneCallback, { RULE_NAME as noDoneCallbackName } from './rules/no-done-callback'
import noDuplicateHooks, { RULE_NAME as noDuplicateHooksName } from './rules/no-duplicate-hooks'
import noLargeSnapshots, { RULE_NAME as noLargeSnapShotsName } from './rules/no-large-snapshots'
import nonInterpolationInSnapShots, { RULE_NAME as noInterpolationInSnapshotsName } from './rules/no-interpolation-in-snapshots'
import noMocksImport, { RULE_NAME as noMocksImportName } from './rules/no-mocks-import'
import noRestrictedMatchers, { RULE_NAME as noRestrictedMatchersName } from './rules/no-restricted-matchers'
import noStandaloneExpect, { RULE_NAME as noStandaloneExpectName } from './rules/no-standalone-expect'
import noTestPrefixes, { RULE_NAME as noTestPrefixesName } from './rules/no-test-prefixes'
import noTestReturnStatement, { RULE_NAME as noTestReturnStatementName } from './rules/no-test-return-statement'
import preferCalledWith, { RULE_NAME as preferCalledWithName } from './rules/prefer-called-with'
import validTitle, { RULE_NAME as validTitleName } from './rules/valid-title'
import validExpect, { RULE_NAME as validExpectName } from './rules/valid-expect'
import preferToBeObject, { RULE_NAME as preferToBeObjectName } from './rules/prefer-to-be-object'
import preferToBeTruthy, { RULE_NAME as preferToBeTruthyName } from './rules/prefer-to-be-truthy'
import preferToBeFalsy, { RULE_NAME as preferToBeFalsyName } from './rules/prefer-to-be-falsy'
import preferToHaveLength, { RULE_NAME as preferToHaveLengthName } from './rules/prefer-to-have-length'
import preferEqualityMatcher, { RULE_NAME as preferEqualityMatcherName } from './rules/prefer-equality-matcher'
import preferStrictEqual, { RULE_NAME as preferStrictEqualName } from './rules/prefer-strict-equal'
import preferExpectResolves, { RULE_NAME as preferExpectResolvesName } from './rules/prefer-expect-resolves'
import preferEach, { RULE_NAME as preferEachName } from './rules/prefer-each'
import preferHooksOnTop, { RULE_NAME as preferHooksOnTopName } from './rules/prefer-hooks-on-top'
import preferHooksInOrder, { RULE_NAME as preferHooksInOrderName } from './rules/prefer-hooks-in-order'
import preferMockPromiseShorthand, { RULE_NAME as preferMockPromiseShortHandName } from './rules/prefer-mock-promise-shorthand'
import preferSnapshotHint, { RULE_NAME as preferSnapshotHintName } from './rules/prefer-snapshot-hint'
import validDescribeCallback, { RULE_NAME as validDescribeCallbackName } from './rules/valid-describe-callback'
import requireTopLevelDescribe, { RULE_NAME as requireTopLevelDescribeName } from './rules/require-top-level-describe'
import requireToThrowMessage, { RULE_NAME as requireToThrowMessageName } from './rules/require-to-throw-message'
import requireHook, { RULE_NAME as requireHookName } from './rules/require-hook'
import preferTodo, { RULE_NAME as preferTodoName } from './rules/prefer-todo'
import preferSpyOn, { RULE_NAME as preferSpyOnName } from './rules/prefer-spy-on'
import preferComparisonMatcher, { RULE_NAME as preferComparisonMatcherName } from './rules/prefer-comparison-matcher'
import preferToContain, { RULE_NAME as preferToContainName } from './rules/prefer-to-contain'
import unboundMethod, { RULE_NAME as unboundMethodName } from './rules/unbound-method'

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
	[lowerCaseTitleName]: 'warn',
	[maxNestedDescribeName]: 'warn',
	[noFocusedTestsName]: 'warn',
	[noConditionalTests]: 'warn',
	[useConsistentTestIt]: 'warn',
	[noHooksName]: 'warn',
	[noRestrictedViMethodsName]: 'warn',
	[useConsistentTestFilename]: 'warn',
	[maxExpectName]: 'warn',
	[noAliasMethodName]: 'warn',
	[noConditonalExpectName]: 'warn',
	[noConditionalInTestName]: 'warn',
	[noDisabledTestsName]: 'warn',
	[noDoneCallbackName]: 'warn',
	[noDuplicateHooksName]: 'warn',
	[noLargeSnapShotsName]: 'warn',
	[noInterpolationInSnapshotsName]: 'warn',
	[noMocksImportName]: 'warn',
	[noRestrictedMatchersName]: 'warn',
	[noStandaloneExpectName]: 'warn',
	[noTestPrefixesName]: 'warn',
	[noTestReturnStatementName]: 'warn',
	[preferCalledWithName]: 'warn',
	[preferToBeFalsyName]: 'warn',
	[preferToBeObjectName]: 'warn',
	[preferToBeTruthyName]: 'warn',
	[preferToHaveLengthName]: 'warn',
	[preferEqualityMatcherName]: 'warn',
	[preferStrictEqualName]: 'warn',
	[preferExpectResolvesName]: 'warn',
	[preferEachName]: 'warn',
	[preferHooksOnTopName]: 'warn',
	[preferHooksInOrderName]: 'warn',
	[preferMockPromiseShortHandName]: 'warn',
	[preferSnapshotHintName]: 'warn',
	[requireTopLevelDescribeName]: 'warn',
	[requireToThrowMessageName]: 'warn',
	[requireHookName]: 'warn',
	[preferTodoName]: 'warn',
	[preferSpyOnName]: 'warn',
	[preferComparisonMatcherName]: 'warn',
	[preferToContainName]: 'warn'
	// [unboundMethodName]: 'warn'
}

const recommended = {
	[expectedExpect]: 'error',
	[noIdenticalTitleName]: 'error',
	[usePreferTobe]: 'error',
	[noCommentedOutTestsName]: 'error',
	[validTitleName]: 'error',
	[validExpectName]: 'error',
	[validDescribeCallbackName]: 'error'
}

export default {
	rules: {
		[lowerCaseTitleName]: lowerCaseTitle,
		[maxNestedDescribeName]: maxNestedDescribe,
		[noIdenticalTitleName]: noIdenticalTitle,
		[noFocusedTestsName]: noFocusedTests,
		[noConditionalTests]: noConditionalTest,
		[expectedExpect]: expectExpect,
		[useConsistentTestIt]: consistentTestIt,
		[usePreferTobe]: preferToBe,
		[noHooksName]: noHooks,
		[noRestrictedViMethodsName]: noRestrictedViMethods,
		[useConsistentTestFilename]: consistentTestFilename,
		[maxExpectName]: maxExpect,
		[noAliasMethodName]: noAliasMethod,
		[noCommentedOutTestsName]: noCommentedOutTests,
		[noConditonalExpectName]: noConditonalExpect,
		[noConditionalInTestName]: noConditionalInTest,
		[noDisabledTestsName]: noDisabledTests,
		[noDoneCallbackName]: noDoneCallback,
		[noDuplicateHooksName]: noDuplicateHooks,
		[noLargeSnapShotsName]: noLargeSnapshots,
		[noInterpolationInSnapshotsName]: nonInterpolationInSnapShots,
		[noMocksImportName]: noMocksImport,
		[noRestrictedMatchersName]: noRestrictedMatchers,
		[noStandaloneExpectName]: noStandaloneExpect,
		[noTestPrefixesName]: noTestPrefixes,
		[noTestReturnStatementName]: noTestReturnStatement,
		[preferCalledWithName]: preferCalledWith,
		[validTitleName]: validTitle,
		[validExpectName]: validExpect,
		[preferToBeFalsyName]: preferToBeFalsy,
		[preferToBeObjectName]: preferToBeObject,
		[preferToBeTruthyName]: preferToBeTruthy,
		[preferToHaveLengthName]: preferToHaveLength,
		[preferEqualityMatcherName]: preferEqualityMatcher,
		[preferStrictEqualName]: preferStrictEqual,
		[preferExpectResolvesName]: preferExpectResolves,
		[preferEachName]: preferEach,
		[preferHooksOnTopName]: preferHooksOnTop,
		[preferHooksInOrderName]: preferHooksInOrder,
		[preferMockPromiseShortHandName]: preferMockPromiseShorthand,
		[preferSnapshotHintName]: preferSnapshotHint,
		[validDescribeCallbackName]: validDescribeCallback,
		[requireTopLevelDescribeName]: requireTopLevelDescribe,
		[requireToThrowMessageName]: requireToThrowMessage,
		[requireHookName]: requireHook,
		[preferTodoName]: preferTodo,
		[preferSpyOnName]: preferSpyOn,
		[preferComparisonMatcherName]: preferComparisonMatcher,
		[preferToContainName]: preferToContain,
		[unboundMethodName]: unboundMethod
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
