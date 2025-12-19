import { Linter } from 'eslint'
import consistentEachFor from './consistent-each-for'
import consistentTestFilename from './consistent-test-filename'
import consistentTestIt from './consistent-test-it'
import consistentVitestVi from './consistent-vitest-vi'
import expectExpect from './expect-expect'
import hoistedApisOnTop from './hoisted-apis-on-top'
import maxExpects from './max-expects'
import maxNestedDescribe from './max-nested-describe'
import noAliasMethods from './no-alias-methods'
import noCommentedOutTests from './no-commented-out-tests'
import noConditionalExpect from './no-conditional-expect'
import noConditionalInTest from './no-conditional-in-test'
import noConditionalTests from './no-conditional-tests'
import noDisabledTests from './no-disabled-tests'
import noDoneCallback from './no-done-callback'
import noDuplicateHooks from './no-duplicate-hooks'
import noFocusedTests from './no-focused-tests'
import noHooks from './no-hooks'
import noIdenticalTitle from './no-identical-title'
import noImportNodeTest from './no-import-node-test'
import noImportingVitestGlobals from './no-importing-vitest-globals'
import noInterpolationInSnapshots from './no-interpolation-in-snapshots'
import noLargeSnapshots from './no-large-snapshots'
import noMocksImport from './no-mocks-import'
import noRestrictedMatchers from './no-restricted-matchers'
import noRestrictedViMethods from './no-restricted-vi-methods'
import noStandaloneExpect from './no-standalone-expect'
import noTestPrefixes from './no-test-prefixes'
import noTestReturnStatement from './no-test-return-statement'
import paddingAroundAfterAllBlocks from './padding-around-after-all-blocks'
import paddingAroundAfterEachBlocks from './padding-around-after-each-blocks'
import paddingAroundAll from './padding-around-all'
import paddingAroundBeforeAllBlocks from './padding-around-before-all-blocks'
import paddingAroundBeforeEachBlocks from './padding-around-before-each-blocks'
import paddingAroundDescribeBlocks from './padding-around-describe-blocks'
import paddingAroundExpectGroups from './padding-around-expect-groups'
import paddingAroundTestBlocks from './padding-around-test-blocks'
import preferCalledExactlyOnceWith from './prefer-called-exactly-once-with'
import preferCalledOnce from './prefer-called-once'
import preferCalledTimes from './prefer-called-times'
import preferCalledWith from './prefer-called-with'
import preferComparisonMatcher from './prefer-comparison-matcher'
import preferDescribeFunctionTitle from './prefer-describe-function-title'
import preferEach from './prefer-each'
import preferEqualityMatcher from './prefer-equality-matcher'
import preferExpectAssertions from './prefer-expect-assertions'
import preferExpectResolves from './prefer-expect-resolves'
import preferExpectTypeOf from './prefer-expect-type-of'
import preferHooksInOrder from './prefer-hooks-in-order'
import preferHooksOnTop from './prefer-hooks-on-top'
import preferImportInMock from './prefer-import-in-mock'
import preferImportingVitestGlobals from './prefer-importing-vitest-globals'
import preferLowercaseTitle from './prefer-lowercase-title'
import preferMockPromiseShorthand from './prefer-mock-promise-shorthand'
import preferSnapshotHint from './prefer-snapshot-hint'
import preferSpyOn from './prefer-spy-on'
import preferStrictBooleanMatchers from './prefer-strict-boolean-matchers'
import preferStrictEqual from './prefer-strict-equal'
import preferToBeFalsy from './prefer-to-be-falsy'
import preferToBeObject from './prefer-to-be-object'
import preferToBeTruthy from './prefer-to-be-truthy'
import preferToBe from './prefer-to-be'
import preferToContain from './prefer-to-contain'
import preferToHaveLength from './prefer-to-have-length'
import preferTodo from './prefer-todo'
import preferViMocked from './prefer-vi-mocked'
import requireAwaitedExpectPoll from './require-awaited-expect-poll'
import requireHook from './require-hook'
import requireImportViMock from './require-import-vi-mock'
import requireLocalTestContextForConcurrentSnapshots from './require-local-test-context-for-concurrent-snapshots'
import requireMockTypeParameters from './require-mock-type-parameters'
import requireToThrowMessage from './require-to-throw-message'
import requireTopLevelDescribe from './require-top-level-describe'
import validDescribeCallback from './valid-describe-callback'
import validExpectInPromise from './valid-expect-in-promise'
import validExpect from './valid-expect'
import validTitle from './valid-title'
import warnTodo from './warn-todo'
import noUnneededAsyncExpectFunction from './no-unneeded-async-expect-function'
import preferToHaveBeenCalledTimes from './prefer-to-have-been-called-times'

export const rules = {
  'consistent-each-for': consistentEachFor,
  'consistent-test-filename': consistentTestFilename,
  'consistent-test-it': consistentTestIt,
  'consistent-vitest-vi': consistentVitestVi,
  'expect-expect': expectExpect,
  'hoisted-apis-on-top': hoistedApisOnTop,
  'max-expects': maxExpects,
  'max-nested-describe': maxNestedDescribe,
  'no-alias-methods': noAliasMethods,
  'no-commented-out-tests': noCommentedOutTests,
  'no-conditional-expect': noConditionalExpect,
  'no-conditional-in-test': noConditionalInTest,
  'no-conditional-tests': noConditionalTests,
  'no-disabled-tests': noDisabledTests,
  'no-done-callback': noDoneCallback,
  'no-duplicate-hooks': noDuplicateHooks,
  'no-focused-tests': noFocusedTests,
  'no-hooks': noHooks,
  'no-identical-title': noIdenticalTitle,
  'no-import-node-test': noImportNodeTest,
  'no-importing-vitest-globals': noImportingVitestGlobals,
  'no-interpolation-in-snapshots': noInterpolationInSnapshots,
  'no-large-snapshots': noLargeSnapshots,
  'no-mocks-import': noMocksImport,
  'no-restricted-matchers': noRestrictedMatchers,
  'no-restricted-vi-methods': noRestrictedViMethods,
  'no-standalone-expect': noStandaloneExpect,
  'no-test-prefixes': noTestPrefixes,
  'no-test-return-statement': noTestReturnStatement,
  'no-unneeded-async-expect-function': noUnneededAsyncExpectFunction,
  'padding-around-after-all-blocks': paddingAroundAfterAllBlocks,
  'padding-around-after-each-blocks': paddingAroundAfterEachBlocks,
  'padding-around-all': paddingAroundAll,
  'padding-around-before-all-blocks': paddingAroundBeforeAllBlocks,
  'padding-around-before-each-blocks': paddingAroundBeforeEachBlocks,
  'padding-around-describe-blocks': paddingAroundDescribeBlocks,
  'padding-around-expect-groups': paddingAroundExpectGroups,
  'padding-around-test-blocks': paddingAroundTestBlocks,
  'prefer-called-exactly-once-with': preferCalledExactlyOnceWith,
  'prefer-called-once': preferCalledOnce,
  'prefer-called-times': preferCalledTimes,
  'prefer-called-with': preferCalledWith,
  'prefer-comparison-matcher': preferComparisonMatcher,
  'prefer-describe-function-title': preferDescribeFunctionTitle,
  'prefer-each': preferEach,
  'prefer-equality-matcher': preferEqualityMatcher,
  'prefer-expect-assertions': preferExpectAssertions,
  'prefer-expect-resolves': preferExpectResolves,
  'prefer-expect-type-of': preferExpectTypeOf,
  'prefer-hooks-in-order': preferHooksInOrder,
  'prefer-hooks-on-top': preferHooksOnTop,
  'prefer-import-in-mock': preferImportInMock,
  'prefer-importing-vitest-globals': preferImportingVitestGlobals,
  'prefer-lowercase-title': preferLowercaseTitle,
  'prefer-mock-promise-shorthand': preferMockPromiseShorthand,
  'prefer-snapshot-hint': preferSnapshotHint,
  'prefer-spy-on': preferSpyOn,
  'prefer-strict-boolean-matchers': preferStrictBooleanMatchers,
  'prefer-strict-equal': preferStrictEqual,
  'prefer-to-be-falsy': preferToBeFalsy,
  'prefer-to-be-object': preferToBeObject,
  'prefer-to-be-truthy': preferToBeTruthy,
  'prefer-to-be': preferToBe,
  'prefer-to-contain': preferToContain,
  'prefer-to-have-been-called-times': preferToHaveBeenCalledTimes,
  'prefer-to-have-length': preferToHaveLength,
  'prefer-todo': preferTodo,
  'prefer-vi-mocked': preferViMocked,
  'require-awaited-expect-poll': requireAwaitedExpectPoll,
  'require-hook': requireHook,
  'require-import-vi-mock': requireImportViMock,
  'require-local-test-context-for-concurrent-snapshots':
    requireLocalTestContextForConcurrentSnapshots,
  'require-mock-type-parameters': requireMockTypeParameters,
  'require-to-throw-message': requireToThrowMessage,
  'require-top-level-describe': requireTopLevelDescribe,
  'valid-describe-callback': validDescribeCallback,
  'valid-expect-in-promise': validExpectInPromise,
  'valid-expect': validExpect,
  'valid-title': validTitle,
  'warn-todo': warnTodo,
} as const

export type RuleList = Partial<
  Record<keyof typeof rules, Linter.StringSeverity>
>
