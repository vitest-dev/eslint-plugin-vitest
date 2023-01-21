import { TSESTree } from '@typescript-eslint/utils'

export enum DescribeAlias {
	'describe' = 'describe',
	'fdescribe' = 'fdescribe',
	'xdescribe' = 'xdescribe',
}

export enum TestCaseName {
	'fit' = 'fit',
	'it' = 'it',
	'test' = 'test',
	'xit' = 'xit',
	'xtest' = 'xtest',
}

export enum HookName {
	'beforeAll' = 'beforeAll',
	'beforeEach' = 'beforeEach',
	'afterAll' = 'afterAll',
	'afterEach' = 'afterEach',
}

export enum ModifierName {
	not = 'not',
	rejects = 'rejects',
	resolves = 'resolves',
}

/**
 * Represents a `CallExpression` with a single argument.
 */
export interface CallExpressionWithSingleArgument<
	Argument extends TSESTree.CallExpression['arguments'][number] = TSESTree.CallExpression['arguments'][number],
> extends TSESTree.CallExpression {
	arguments: [Argument];
}
