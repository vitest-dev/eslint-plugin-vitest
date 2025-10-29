import { Linter } from 'eslint'
import {
  default as consistentTestFilename,
  RULE_NAME as consistentTestFilenameName,
} from './consistent-test-filename'
import {
  default as consistentTestIt,
  RULE_NAME as consistentTestItName,
} from './consistent-test-it'
import {
  default as consistentVitestVi,
  RULE_NAME as consistentVitestViName,
} from './consistent-vitest-vi'
import {
  default as expectExpect,
  RULE_NAME as expectExpectName,
} from './expect-expect'
import {
  default as hoistedApisOnTop,
  RULE_NAME as hoistedApisOnTopName,
} from './hoisted-apis-on-top'
import {
  default as maxExpects,
  RULE_NAME as maxExpectsName,
} from './max-expects'
import {
  default as maxNestedDescribe,
  RULE_NAME as maxNestedDescribeName,
} from './max-nested-describe'
import {
  default as noAliasMethods,
  RULE_NAME as noAliasMethodsName,
} from './no-alias-methods'
import {
  default as noCommentedOutTests,
  RULE_NAME as noCommentedOutTestsName,
} from './no-commented-out-tests'
import {
  default as noConditionalExpect,
  RULE_NAME as noConditionalExpectName,
} from './no-conditional-expect'
import {
  default as noConditionalInTest,
  RULE_NAME as noConditionalInTestName,
} from './no-conditional-in-test'
import {
  default as noConditionalTests,
  RULE_NAME as noConditionalTestsName,
} from './no-conditional-tests'
import {
  default as noDisabledTests,
  RULE_NAME as noDisabledTestsName,
} from './no-disabled-tests'
import {
  default as noDoneCallback,
  RULE_NAME as noDoneCallbackName,
} from './no-done-callback'
import {
  default as noDuplicateHooks,
  RULE_NAME as noDuplicateHooksName,
} from './no-duplicate-hooks'
import {
  default as noFocusedTests,
  RULE_NAME as noFocusedTestsName,
} from './no-focused-tests'
import { default as noHooks, RULE_NAME as noHooksName } from './no-hooks'
import {
  default as noIdenticalTitle,
  RULE_NAME as noIdenticalTitleName,
} from './no-identical-title'
import {
  default as noImportNodeTest,
  RULE_NAME as noImportNodeTestName,
} from './no-import-node-test'
import {
  default as noImportingVitestGlobals,
  RULE_NAME as noImportingVitestGlobalsName,
} from './no-importing-vitest-globals'
import {
  default as noInterpolationInSnapshots,
  RULE_NAME as noInterpolationInSnapshotsName,
} from './no-interpolation-in-snapshots'
import {
  default as noLargeSnapshots,
  RULE_NAME as noLargeSnapshotsName,
} from './no-large-snapshots'
import {
  default as noMocksImport,
  RULE_NAME as noMocksImportName,
} from './no-mocks-import'
import {
  default as noRestrictedMatchers,
  RULE_NAME as noRestrictedMatchersName,
} from './no-restricted-matchers'
import {
  default as noRestrictedViMethods,
  RULE_NAME as noRestrictedViMethodsName,
} from './no-restricted-vi-methods'
import {
  default as noStandaloneExpect,
  RULE_NAME as noStandaloneExpectName,
} from './no-standalone-expect'
import {
  default as noTestPrefixes,
  RULE_NAME as noTestPrefixesName,
} from './no-test-prefixes'
import {
  default as noTestReturnStatement,
  RULE_NAME as noTestReturnStatementName,
} from './no-test-return-statement'
import {
  default as paddingAroundAfterAllBlocks,
  RULE_NAME as paddingAroundAfterAllBlocksName,
} from './padding-around-after-all-blocks'
import {
  default as paddingAroundAfterEachBlocks,
  RULE_NAME as paddingAroundAfterEachBlocksName,
} from './padding-around-after-each-blocks'
import {
  default as paddingAroundAll,
  RULE_NAME as paddingAroundAllName,
} from './padding-around-all'
import {
  default as paddingAroundBeforeAllBlocks,
  RULE_NAME as paddingAroundBeforeAllBlocksName,
} from './padding-around-before-all-blocks'
import {
  default as paddingAroundBeforeEachBlocks,
  RULE_NAME as paddingAroundBeforeEachBlocksName,
} from './padding-around-before-each-blocks'
import {
  default as paddingAroundDescribeBlocks,
  RULE_NAME as paddingAroundDescribeBlocksName,
} from './padding-around-describe-blocks'
import {
  default as paddingAroundExpectGroups,
  RULE_NAME as paddingAroundExpectGroupsName,
} from './padding-around-expect-groups'
import {
  default as paddingAroundTestBlocks,
  RULE_NAME as paddingAroundTestBlocksName,
} from './padding-around-test-blocks'
import {
  default as preferCalledExactlyOnceWith,
  RULE_NAME as preferCalledExactlyOnceWithName,
} from './prefer-called-exactly-once-with'
import {
  default as preferCalledOnce,
  RULE_NAME as preferCalledOnceName,
} from './prefer-called-once'
import {
  default as preferCalledTimes,
  RULE_NAME as preferCalledTimesName,
} from './prefer-called-times'
import {
  default as preferCalledWith,
  RULE_NAME as preferCalledWithName,
} from './prefer-called-with'
import {
  default as preferComparisonMatcher,
  RULE_NAME as preferComparisonMatcherName,
} from './prefer-comparison-matcher'
import {
  default as preferDescribeFunctionTitle,
  RULE_NAME as preferDescribeFunctionTitleName,
} from './prefer-describe-function-title'
import {
  default as preferEach,
  RULE_NAME as preferEachName,
} from './prefer-each'
import {
  default as preferEqualityMatcher,
  RULE_NAME as preferEqualityMatcherName,
} from './prefer-equality-matcher'
import {
  default as preferExpectAssertions,
  RULE_NAME as preferExpectAssertionsName,
} from './prefer-expect-assertions'
import {
  default as preferExpectResolves,
  RULE_NAME as preferExpectResolvesName,
} from './prefer-expect-resolves'
import {
  default as preferExpectTypeOf,
  RULE_NAME as preferExpectTypeOfName,
} from './prefer-expect-type-of'
import {
  default as preferHooksInOrder,
  RULE_NAME as preferHooksInOrderName,
} from './prefer-hooks-in-order'
import {
  default as preferHooksOnTop,
  RULE_NAME as preferHooksOnTopName,
} from './prefer-hooks-on-top'
import {
  default as preferImportInMock,
  RULE_NAME as preferImportInMockName,
} from './prefer-import-in-mock'
import {
  default as preferImportingVitestGlobals,
  RULE_NAME as preferImportingVitestGlobalsName,
} from './prefer-importing-vitest-globals'
import {
  default as preferLowercaseTitle,
  RULE_NAME as preferLowercaseTitleName,
} from './prefer-lowercase-title'
import {
  default as preferMockPromiseShorthand,
  RULE_NAME as preferMockPromiseShorthandName,
} from './prefer-mock-promise-shorthand'
import {
  default as preferSnapshotHint,
  RULE_NAME as preferSnapshotHintName,
} from './prefer-snapshot-hint'
import {
  default as preferSpyOn,
  RULE_NAME as preferSpyOnName,
} from './prefer-spy-on'
import {
  default as preferStrictBooleanMatchers,
  RULE_NAME as preferStrictBooleanMatchersName,
} from './prefer-strict-boolean-matchers'
import {
  default as preferStrictEqual,
  RULE_NAME as preferStrictEqualName,
} from './prefer-strict-equal'
import {
  default as preferToBeFalsy,
  RULE_NAME as preferToBeFalsyName,
} from './prefer-to-be-falsy'
import {
  default as preferToBeObject,
  RULE_NAME as preferToBeObjectName,
} from './prefer-to-be-object'
import {
  default as preferToBeTruthy,
  RULE_NAME as preferToBeTruthyName,
} from './prefer-to-be-truthy'
import {
  default as preferToBe,
  RULE_NAME as preferToBeName,
} from './prefer-to-be'
import {
  default as preferToContain,
  RULE_NAME as preferToContainName,
} from './prefer-to-contain'
import {
  default as preferToHaveLength,
  RULE_NAME as preferToHaveLengthName,
} from './prefer-to-have-length'
import {
  default as preferTodo,
  RULE_NAME as preferTodoName,
} from './prefer-todo'
import {
  default as preferViMocked,
  RULE_NAME as preferViMockedName,
} from './prefer-vi-mocked'
import {
  default as requireHook,
  RULE_NAME as requireHookName,
} from './require-hook'
import {
  default as requireLocalTestContextForConcurrentSnapshots,
  RULE_NAME as requireLocalTestContextForConcurrentSnapshotsName,
} from './require-local-test-context-for-concurrent-snapshots'
import {
  default as requireMockTypeParameters,
  RULE_NAME as requireMockTypeParametersName,
} from './require-mock-type-parameters'
import {
  default as requireToThrowMessage,
  RULE_NAME as requireToThrowMessageName,
} from './require-to-throw-message'
import {
  default as requireTopLevelDescribe,
  RULE_NAME as requireTopLevelDescribeName,
} from './require-top-level-describe'
import {
  default as validDescribeCallback,
  RULE_NAME as validDescribeCallbackName,
} from './valid-describe-callback'
import {
  default as validExpectInPromise,
  RULE_NAME as validExpectInPromiseName,
} from './valid-expect-in-promise'
import {
  default as validExpect,
  RULE_NAME as validExpectName,
} from './valid-expect'
import {
  default as validTitle,
  RULE_NAME as validTitleName,
} from './valid-title'
import { default as warnTodo, RULE_NAME as warnTodoName } from './warn-todo'

export const rules = {
  [consistentTestFilenameName]: consistentTestFilename,
  [consistentTestItName]: consistentTestIt,
  [consistentVitestViName]: consistentVitestVi,
  [expectExpectName]: expectExpect,
  [hoistedApisOnTopName]: hoistedApisOnTop,
  [maxExpectsName]: maxExpects,
  [maxNestedDescribeName]: maxNestedDescribe,
  [noAliasMethodsName]: noAliasMethods,
  [noCommentedOutTestsName]: noCommentedOutTests,
  [noConditionalExpectName]: noConditionalExpect,
  [noConditionalInTestName]: noConditionalInTest,
  [noConditionalTestsName]: noConditionalTests,
  [noDisabledTestsName]: noDisabledTests,
  [noDoneCallbackName]: noDoneCallback,
  [noDuplicateHooksName]: noDuplicateHooks,
  [noFocusedTestsName]: noFocusedTests,
  [noHooksName]: noHooks,
  [noIdenticalTitleName]: noIdenticalTitle,
  [noImportNodeTestName]: noImportNodeTest,
  [noImportingVitestGlobalsName]: noImportingVitestGlobals,
  [noInterpolationInSnapshotsName]: noInterpolationInSnapshots,
  [noLargeSnapshotsName]: noLargeSnapshots,
  [noMocksImportName]: noMocksImport,
  [noRestrictedMatchersName]: noRestrictedMatchers,
  [noRestrictedViMethodsName]: noRestrictedViMethods,
  [noStandaloneExpectName]: noStandaloneExpect,
  [noTestPrefixesName]: noTestPrefixes,
  [noTestReturnStatementName]: noTestReturnStatement,
  [paddingAroundAfterAllBlocksName]: paddingAroundAfterAllBlocks,
  [paddingAroundAfterEachBlocksName]: paddingAroundAfterEachBlocks,
  [paddingAroundAllName]: paddingAroundAll,
  [paddingAroundBeforeAllBlocksName]: paddingAroundBeforeAllBlocks,
  [paddingAroundBeforeEachBlocksName]: paddingAroundBeforeEachBlocks,
  [paddingAroundDescribeBlocksName]: paddingAroundDescribeBlocks,
  [paddingAroundExpectGroupsName]: paddingAroundExpectGroups,
  [paddingAroundTestBlocksName]: paddingAroundTestBlocks,
  [preferCalledExactlyOnceWithName]: preferCalledExactlyOnceWith,
  [preferCalledOnceName]: preferCalledOnce,
  [preferCalledTimesName]: preferCalledTimes,
  [preferCalledWithName]: preferCalledWith,
  [preferComparisonMatcherName]: preferComparisonMatcher,
  [preferDescribeFunctionTitleName]: preferDescribeFunctionTitle,
  [preferEachName]: preferEach,
  [preferEqualityMatcherName]: preferEqualityMatcher,
  [preferExpectAssertionsName]: preferExpectAssertions,
  [preferExpectResolvesName]: preferExpectResolves,
  [preferExpectTypeOfName]: preferExpectTypeOf,
  [preferHooksInOrderName]: preferHooksInOrder,
  [preferHooksOnTopName]: preferHooksOnTop,
  [preferImportInMockName]: preferImportInMock,
  [preferImportingVitestGlobalsName]: preferImportingVitestGlobals,
  [preferLowercaseTitleName]: preferLowercaseTitle,
  [preferMockPromiseShorthandName]: preferMockPromiseShorthand,
  [preferSnapshotHintName]: preferSnapshotHint,
  [preferSpyOnName]: preferSpyOn,
  [preferStrictBooleanMatchersName]: preferStrictBooleanMatchers,
  [preferStrictEqualName]: preferStrictEqual,
  [preferToBeFalsyName]: preferToBeFalsy,
  [preferToBeObjectName]: preferToBeObject,
  [preferToBeTruthyName]: preferToBeTruthy,
  [preferToBeName]: preferToBe,
  [preferToContainName]: preferToContain,
  [preferToHaveLengthName]: preferToHaveLength,
  [preferTodoName]: preferTodo,
  [preferViMockedName]: preferViMocked,
  [requireHookName]: requireHook,
  [requireLocalTestContextForConcurrentSnapshotsName]:
    requireLocalTestContextForConcurrentSnapshots,
  [requireMockTypeParametersName]: requireMockTypeParameters,
  [requireToThrowMessageName]: requireToThrowMessage,
  [requireTopLevelDescribeName]: requireTopLevelDescribe,
  [validDescribeCallbackName]: validDescribeCallback,
  [validExpectInPromiseName]: validExpectInPromise,
  [validExpectName]: validExpect,
  [validTitleName]: validTitle,
  [warnTodoName]: warnTodo,
} as const

export type RuleList = Partial<
  Record<keyof typeof rules, Linter.StringSeverity>
>
