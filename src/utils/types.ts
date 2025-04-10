import { TSESTree } from '@typescript-eslint/utils'
import ts from 'typescript'

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
  to = 'to',
  have = 'have',
  not = 'not',
  rejects = 'rejects',
  resolves = 'resolves',
  returns = 'returns',
  branded = 'branded',
  asserts = 'asserts',
  constructorParameters = 'constructorParameters',
  parameters = 'parameters',
  thisParameter = 'thisParameter',
  guards = 'guards',
  instance = 'instance',
  items = 'items'
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
  | Expression

export type TSTypeCastExpression<
  Expression extends TSESTree.Expression = TSESTree.Expression
> = AsExpressionChain<Expression> | TypeAssertionChain<Expression>

interface AsExpressionChain<
  Expression extends TSESTree.Expression = TSESTree.Expression
> extends TSESTree.TSAsExpression {
  expression: AsExpressionChain<Expression> | Expression
}

interface TypeAssertionChain<
  Expression extends TSESTree.Expression = TSESTree.Expression
> extends TSESTree.TSTypeAssertion {
  expression: TypeAssertionChain<Expression> | Expression
}

export function isClassOrFunctionType(type: ts.Type): boolean {
  return type
    .getSymbol()
    ?.getDeclarations()
    ?.some(
      declaration =>
        ts.isArrowFunction(declaration)
        || ts.isClassDeclaration(declaration)
        || ts.isClassExpression(declaration)
        || ts.isFunctionDeclaration(declaration)
        || ts.isFunctionExpression(declaration)
        || ts.isMethodDeclaration(declaration)
    ) ?? false
}
