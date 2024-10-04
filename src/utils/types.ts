import { TSESTree } from '@typescript-eslint/utils'

export enum DescribeAlias {
  describe = 'describe',
  fdescribe = 'fdescribe',
  xdescribe = 'xdescribe'
}

export enum TestCaseName {
  fit = 'fit',
  it = 'it',
  test = 'test',
  xit = 'xit',
  xtest = 'xtest',
  bench = 'bench'
}

export enum HookName {
  beforeAll = 'beforeAll',
  beforeEach = 'beforeEach',
  afterAll = 'afterAll',
  afterEach = 'afterEach'
}

export enum ModifierName {
  not = 'not',
  rejects = 'rejects',
  resolves = 'resolves'
}

/**
 * Represents a `CallExpression` with a single argument.
 */
export interface CallExpressionWithSingleArgument<
    Argument extends TSESTree.CallExpression['arguments'][number] = TSESTree.CallExpression['arguments'][number]
> extends TSESTree.CallExpression {
  arguments: [Argument]
}

export enum EqualityMatcher {
  toBe = 'toBe',
  toEqual = 'toEqual',
  toStrictEqual = 'toStrictEqual'
}

export type MaybeTypeCast<Expression extends TSESTree.Expression> =
  | TSTypeCastExpression<Expression>
  | Expression;

export type TSTypeCastExpression<
  Expression extends TSESTree.Expression = TSESTree.Expression
> = AsExpressionChain<Expression> | TypeAssertionChain<Expression>;

interface AsExpressionChain<
  Expression extends TSESTree.Expression = TSESTree.Expression
> extends TSESTree.TSAsExpression {
  expression: AsExpressionChain<Expression> | Expression;
}

interface TypeAssertionChain<
  Expression extends TSESTree.Expression = TSESTree.Expression
> extends TSESTree.TSTypeAssertion {
  expression: TypeAssertionChain<Expression> | Expression;
}
