import type { ESLint, Linter, Rule } from 'eslint'
import { version } from '../package.json'
import { rules, type RuleList } from './rules'

const createConfig = <R extends Linter.RulesRecord>(rules: R) =>
  Object.keys(rules).reduce((acc, ruleName) => {
    return {
      ...acc,
      [`vitest/${ruleName}`]: rules[ruleName],
    }
  }, {}) as {
    [K in keyof R as `vitest/${Extract<K, string>}`]: R[K]
  }

const createConfigLegacy = (rules: Record<string, string>) => ({
  plugins: ['@vitest'],
  rules: Object.keys(rules).reduce((acc, ruleName) => {
    return {
      ...acc,
      [`@vitest/${ruleName}`]: rules[ruleName],
    }
  }, {}),
})

const allRules = {
  'consistent-test-filename': 'warn',
  'consistent-test-it': 'warn',
  'consistent-vitest-vi': 'warn',
  'expect-expect': 'warn',
  'hoisted-apis-on-top': 'warn',
  'max-expects': 'warn',
  'max-nested-describe': 'warn',
  'no-alias-methods': 'warn',
  'no-commented-out-tests': 'warn',
  'no-conditional-expect': 'warn',
  'no-conditional-in-test': 'warn',
  'no-conditional-tests': 'warn',
  'no-disabled-tests': 'warn',
  'no-duplicate-hooks': 'warn',
  'no-focused-tests': 'warn',
  'no-hooks': 'warn',
  'no-identical-title': 'warn',
  'no-import-node-test': 'warn',
  'no-importing-vitest-globals': 'off',
  'no-interpolation-in-snapshots': 'warn',
  'no-large-snapshots': 'warn',
  'no-mocks-import': 'warn',
  'no-restricted-matchers': 'warn',
  'no-restricted-vi-methods': 'warn',
  'no-standalone-expect': 'warn',
  'no-test-prefixes': 'warn',
  'no-test-return-statement': 'warn',
  'padding-around-after-all-blocks': 'warn',
  'padding-around-after-each-blocks': 'warn',
  'padding-around-all': 'warn',
  'padding-around-before-all-blocks': 'warn',
  'padding-around-before-each-blocks': 'warn',
  'padding-around-describe-blocks': 'warn',
  'padding-around-expect-groups': 'warn',
  'padding-around-test-blocks': 'warn',
  'prefer-called-exactly-once-with': 'warn',
  'prefer-called-once': 'off',
  'prefer-called-times': 'warn',
  'prefer-called-with': 'warn',
  'prefer-comparison-matcher': 'warn',
  'prefer-describe-function-title': 'warn',
  'prefer-each': 'warn',
  'prefer-equality-matcher': 'warn',
  'prefer-expect-assertions': 'warn',
  'prefer-expect-resolves': 'warn',
  'prefer-expect-type-of': 'warn',
  'prefer-hooks-in-order': 'warn',
  'prefer-hooks-on-top': 'warn',
  'prefer-import-in-mock': 'warn',
  'prefer-importing-vitest-globals': 'warn',
  'prefer-lowercase-title': 'warn',
  'prefer-mock-promise-shorthand': 'warn',
  'prefer-snapshot-hint': 'warn',
  'prefer-spy-on': 'warn',
  'prefer-strict-boolean-matchers': 'warn',
  'prefer-strict-equal': 'warn',
  'prefer-to-be-falsy': 'off',
  'prefer-to-be-object': 'warn',
  'prefer-to-be-truthy': 'off',
  'prefer-to-be': 'warn',
  'prefer-to-contain': 'warn',
  'prefer-to-have-length': 'warn',
  'prefer-todo': 'warn',
  'prefer-vi-mocked': 'warn',
  'require-hook': 'warn',
  'require-local-test-context-for-concurrent-snapshots': 'warn',
  'require-mock-type-parameters': 'warn',
  'require-to-throw-message': 'warn',
  'require-top-level-describe': 'warn',
  'valid-describe-callback': 'warn',
  'valid-expect-in-promise': 'warn',
  'valid-expect': 'warn',
  'valid-title': 'warn',
  'require-awaited-expect-poll': 'warn',
  'require-import-vi-mock': 'warn',
} as const satisfies RuleList

const recommendedRules = {
  'expect-expect': 'error',
  'no-commented-out-tests': 'error',
  'no-identical-title': 'error',
  'no-import-node-test': 'error',
  'prefer-called-exactly-once-with': 'error',
  'require-local-test-context-for-concurrent-snapshots': 'error',
  'valid-describe-callback': 'error',
  'valid-expect': 'error',
  'valid-title': 'error',
} as const satisfies RuleList

const plugin = {
  meta: {
    name: 'vitest',
    version,
  },
  rules: rules as unknown as Record<string, Rule.RuleModule>,
  environments: {
    env: {
      globals: {
        suite: true,
        test: true,
        describe: true,
        it: true,
        expectTypeOf: true,
        assertType: true,
        expect: true,
        assert: true,
        chai: true,
        vitest: true,
        vi: true,
        beforeAll: true,
        afterAll: true,
        beforeEach: true,
        afterEach: true,
        onTestFailed: true,
        onTestFinished: true,
      },
    },
  },
  configs: {
    'legacy-recommended': createConfigLegacy(recommendedRules),
    'legacy-all': createConfigLegacy(allRules),
    recommended: {
      name: 'vitest/recommended',
      plugins: {
        get vitest(): ESLint.Plugin {
          return plugin
        },
      },
      rules: createConfig(recommendedRules),
    },
    all: {
      name: 'vitest/all',
      plugins: {
        get vitest(): ESLint.Plugin {
          return plugin
        },
      },
      rules: createConfig(allRules),
    },
    env: {
      name: 'vitest/env',
      languageOptions: {
        globals: {
          suite: 'writable',
          test: 'writable',
          describe: 'writable',
          it: 'writable',
          expectTypeOf: 'writable',
          assertType: 'writable',
          expect: 'writable',
          assert: 'writable',
          chai: 'writable',
          vitest: 'writable',
          vi: 'writable',
          beforeAll: 'writable',
          afterAll: 'writable',
          beforeEach: 'writable',
          afterEach: 'writable',
          onTestFailed: 'writable',
          onTestFinished: 'writable',
        },
      },
    },
  },
} as const satisfies ESLint.Plugin

export default plugin
