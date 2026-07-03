import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils'
import { DescribeAlias, HookName, ModifierName, TestCaseName } from './types'
import { ValidVitestFnCallChains } from './valid-vitest-fn-call-chains'
import {
  AccessorNode,
  getAccessorValue,
  getNodeName,
  getStringValue,
  isFunction,
  isIdentifier,
  isStringNode,
  isSupportedAccessor,
} from '.'
import { getScope } from './scope'

export type VitestFnType =
  | 'test'
  | 'it'
  | 'describe'
  | 'bench'
  | 'expect'
  | 'unknown'
  | 'hook'
  | 'vi'
  | 'expectTypeOf'

interface ResolvedVitestFn {
  original: string | null
  local: string
  type: 'import' | 'global' | 'testContext'
}

interface ImportDetails {
  source: string
  local: string
  imported: string
}

export interface ResolvedVitestFnWithNode extends ResolvedVitestFn {
  node: AccessorNode
}

export interface KnownMemberExpression<Name extends string = string>
  extends TSESTree.MemberExpressionComputedName {
  property: AccessorNode<Name>
}

export type KnownMemberExpressionProperty<Specifies extends string = string> =
  AccessorNode<Specifies> & { parent: KnownMemberExpression<Specifies> }

interface ModifiersAndMatcher {
  modifiers: KnownMemberExpressionProperty[]
  matcher: KnownMemberExpressionProperty
  /** The arguments that are being passed to the `matcher` */
  args: TSESTree.CallExpression['arguments']
}

type ExpectChainKind = 'language-chain' | 'modifier' | 'matcher' | 'unknown'

interface ExpectChain {
  kind: ExpectChainKind
  member: KnownMemberExpressionProperty
  callExpression: TSESTree.CallExpression | null
}

interface BaseParsedVitestFnCall {
  /**
   * The name of the underlying Vitest function that is being called.
   * This is the result of `(head.original ?? head.local)`.
   */
  name: string
  type: VitestFnType
  head: ResolvedVitestFnWithNode
  members: KnownMemberExpressionProperty[]
}

interface ParsedGeneralVitestFnCall extends BaseParsedVitestFnCall {
  type: Exclude<VitestFnType, 'expect' | 'expectTypeOf'>
}

type Reason = 'matcher-not-called' | 'modifier-unknown' | 'matcher-not-found'

export interface ParsedExpectVitestFnCall
  extends BaseParsedVitestFnCall, ModifiersAndMatcher {
  type: 'expect' | 'expectTypeOf'
}

export type ParsedVitestFnCall =
  | ParsedGeneralVitestFnCall
  | ParsedExpectVitestFnCall

export const isTypeOfVitestFnCall = (
  node: TSESTree.CallExpression,
  context: TSESLint.RuleContext<string, readonly unknown[]>,
  types: VitestFnType[],
) => {
  const vitestFnCall = parseVitestFnCall(node, context)
  return vitestFnCall !== null && types.includes(vitestFnCall.type)
}

export const parseVitestFnCall = (
  node: TSESTree.CallExpression,
  context: TSESLint.RuleContext<string, readonly unknown[]>,
): ParsedVitestFnCall | null => {
  const vitestFnCall = parseVitestFnCallWithReason(node, context)

  if (typeof vitestFnCall === 'string') return null

  return vitestFnCall
}

const parseVitestFnCallCache = new WeakMap<
  TSESTree.CallExpression,
  ParsedVitestFnCall | Reason | null
>()

export const parseVitestFnCallWithReason = (
  node: TSESTree.CallExpression,
  context: TSESLint.RuleContext<string, readonly unknown[]>,
): ParsedVitestFnCall | Reason | null => {
  let parsedVitestFnCall = parseVitestFnCallCache.get(node)

  if (parsedVitestFnCall) return parsedVitestFnCall

  parsedVitestFnCall = parseVitestFnCallWithReasonInner(node, context)

  parseVitestFnCallCache.set(node, parsedVitestFnCall)

  return parsedVitestFnCall
}

const determineVitestFnType = (name: string): VitestFnType => {
  if (name === 'expect') return 'expect'

  if (name === 'expectTypeOf') return 'expectTypeOf'

  if (name === 'vi' || name === 'vitest') return 'vi'

  if (Object.prototype.hasOwnProperty.call(DescribeAlias, name))
    return 'describe'

  if (Object.prototype.hasOwnProperty.call(TestCaseName, name)) return 'test'

  if (Object.prototype.hasOwnProperty.call(HookName, name)) return 'hook'

  return 'unknown'
}

const hasInvalidExpectChain = (
  chains: ExpectChain[],
  matcherIndex: number,
): boolean => {
  const modifierChains =
    matcherIndex === -1 ? chains : chains.slice(0, matcherIndex)

  if (
    modifierChains.some(
      (chain) =>
        chain.kind === 'unknown' ||
        (chain.kind !== 'matcher' && chain.callExpression),
    )
  )
    return true

  const modifierNames = modifierChains
    .filter((chain) => chain.kind === 'modifier')
    .map((chain) => getAccessorValue(chain.member))

  if (modifierNames.filter((name) => name === ModifierName.not).length > 1)
    return true

  const promiseModifierNames = modifierNames.filter((name) =>
    promiseExpectModifiers.has(name),
  )

  if (promiseModifierNames.length > 1) return true

  return !chains
    .slice(matcherIndex + 1)
    .every(
      (chain) =>
        chain.kind !== 'unknown' &&
        (chain.kind === 'matcher' || !chain.callExpression),
    )
}

const chaiLanguageChainProperties = new Set([
  'also',
  'and',
  'at',
  'be',
  'been',
  'but',
  'does',
  'has',
  'have',
  'is',
  'itself',
  'of',
  'same',
  'still',
  'that',
  'to',
  'which',
  'with',
])

const chaiFlagChainProperties = new Set([
  'all',
  'any',
  'deep',
  'nested',
  'ordered',
  'own',
])

const chaiDualRoleChainProperties = new Set([
  'a',
  'an',
  'contain',
  'contains',
  'include',
  'includes',
  'length',
  'lengthOf',
  'respondTo',
])

const chaiChainableProperties = new Set([
  ...chaiLanguageChainProperties,
  ...chaiFlagChainProperties,
  ...chaiDualRoleChainProperties,
])

const expectModifiers = new Set<string>([
  ModifierName.not,
  ModifierName.rejects,
  ModifierName.resolves,
])

const promiseExpectModifiers = new Set<string>([
  ModifierName.rejects,
  ModifierName.resolves,
])

const expectTypeOfModifiers = new Set<string>([
  ModifierName.not,
  ModifierName.resolves,
  ModifierName.returns,
  ModifierName.branded,
  ModifierName.asserts,
  ModifierName.constructorParameters,
  ModifierName.parameters,
  ModifierName.thisParameter,
  ModifierName.guards,
  ModifierName.instance,
  ModifierName.items,
])

const getCallExpression = (
  member: KnownMemberExpressionProperty,
): TSESTree.CallExpression | null =>
  member.parent?.type === AST_NODE_TYPES.MemberExpression &&
  member.parent.parent?.type === AST_NODE_TYPES.CallExpression &&
  member.parent.parent.callee === member.parent
    ? member.parent.parent
    : null

const classifyExpectChain = (
  member: KnownMemberExpressionProperty,
): ExpectChain => {
  const name = getAccessorValue(member)
  const callExpression = getCallExpression(member)

  if (callExpression) {
    if (
      expectModifiers.has(name) ||
      (chaiChainableProperties.has(name) &&
        !chaiDualRoleChainProperties.has(name))
    )
      return { kind: 'language-chain', member, callExpression }

    return { kind: 'matcher', member, callExpression }
  }

  if (chaiChainableProperties.has(name))
    return { kind: 'language-chain', member, callExpression }

  if (!expectModifiers.has(name))
    return { kind: 'unknown', member, callExpression }

  return { kind: 'modifier', member, callExpression }
}

const parseExpectCallExpression = (
  node: TSESTree.CallExpression,
  topMostCallExpression: TSESTree.CallExpression,
  typeLessParsedVitestFnCall: Omit<ParsedVitestFnCall, 'type'>,
): ParsedExpectVitestFnCall | Reason | null => {
  const chains = typeLessParsedVitestFnCall.members.map(classifyExpectChain)
  const matcherIndex = chains.findIndex((chain) => chain.kind === 'matcher')

  if (
    node.parent?.type === AST_NODE_TYPES.MemberExpression &&
    topMostCallExpression !== node
  )
    return null

  if (hasInvalidExpectChain(chains, matcherIndex)) return 'modifier-unknown'

  if (matcherIndex === -1) {
    if (node.parent?.type === AST_NODE_TYPES.MemberExpression)
      return 'matcher-not-called'

    return 'matcher-not-found'
  }

  const modifierChains = chains.slice(0, matcherIndex)
  const matcher = chains[matcherIndex]

  return {
    ...typeLessParsedVitestFnCall,
    type: 'expect',
    members: typeLessParsedVitestFnCall.members.slice(0, matcherIndex + 1),
    matcher: matcher.member,
    args: matcher.callExpression?.arguments ?? [],
    modifiers: modifierChains
      .filter((chain) => chain.kind === 'modifier')
      .map((chain) => chain.member),
  }
}

const parseExpectTypeOfCallExpression = (
  node: TSESTree.CallExpression,
  topMostCallExpression: TSESTree.CallExpression,
  typeLessParsedVitestFnCall: Omit<ParsedVitestFnCall, 'type'>,
): ParsedExpectVitestFnCall | Reason | null => {
  const matcherIndex = typeLessParsedVitestFnCall.members.findIndex((member) =>
    getCallExpression(member),
  )
  const modifierMembers =
    matcherIndex === -1
      ? typeLessParsedVitestFnCall.members
      : typeLessParsedVitestFnCall.members.slice(0, matcherIndex)
  const modifierNames = modifierMembers.map(getAccessorValue)

  if (
    node.parent?.type === AST_NODE_TYPES.MemberExpression &&
    topMostCallExpression !== node
  )
    return null

  if (
    modifierMembers.some(
      (member) => !expectTypeOfModifiers.has(getAccessorValue(member)),
    ) ||
    modifierNames.filter((name) => name === ModifierName.not).length > 1 ||
    (matcherIndex !== -1 &&
      expectTypeOfModifiers.has(
        getAccessorValue(typeLessParsedVitestFnCall.members[matcherIndex]),
      ))
  ) {
    return 'modifier-unknown'
  }

  if (matcherIndex === -1) {
    if (node.parent?.type === AST_NODE_TYPES.MemberExpression)
      return 'matcher-not-called'

    return 'matcher-not-found'
  }

  const matcher = typeLessParsedVitestFnCall.members[matcherIndex]
  const callExpression = getCallExpression(matcher)

  if (!callExpression) return null

  return {
    ...typeLessParsedVitestFnCall,
    type: 'expectTypeOf',
    matcher,
    args: callExpression.arguments,
    modifiers: modifierMembers,
  }
}

export const findTopMostCallExpression = (
  node: TSESTree.CallExpression,
): TSESTree.CallExpression => {
  let topMostCallExpression = node
  let { parent } = node

  while (parent) {
    if (parent.type === AST_NODE_TYPES.CallExpression) {
      topMostCallExpression = parent

      parent = parent.parent

      continue
    }

    if (parent.type !== AST_NODE_TYPES.MemberExpression) break

    parent = parent.parent
  }

  return topMostCallExpression
}

const parseVitestFnCallWithReasonInner = (
  node: TSESTree.CallExpression,
  context: TSESLint.RuleContext<string, readonly unknown[]>,
): ParsedVitestFnCall | Reason | null => {
  const chain = getNodeChain(node)

  if (!chain?.length) return null

  const [first, ...rest] = chain

  const lastLink = getAccessorValue(chain[chain.length - 1])

  if (lastLink === 'each') {
    if (
      node.callee.type !== AST_NODE_TYPES.CallExpression &&
      node.callee.type !== AST_NODE_TYPES.TaggedTemplateExpression
    )
      return null
  }

  if (
    node.callee.type === AST_NODE_TYPES.TaggedTemplateExpression &&
    lastLink !== 'each'
  )
    return null

  const resolved = resolveVitestFn(context, node, getAccessorValue(first))

  if (!resolved) return null

  const name = resolved.original ?? resolved.local

  const links = [name, ...rest.map(getAccessorValue)]

  if (
    resolved.type !== 'testContext' &&
    name !== 'vi' &&
    name !== 'vitest' &&
    name !== 'expect' &&
    name !== 'expectTypeOf' &&
    !ValidVitestFnCallChains.has(links.join('.'))
  )
    return null

  const parsedVitestFnCall: Omit<ParsedVitestFnCall, 'type'> = {
    name,
    head: { ...resolved, node: first },
    members: rest as KnownMemberExpressionProperty[],
  }

  const type = determineVitestFnType(name)

  if (type === 'expect' || type === 'expectTypeOf') {
    const topMostCallExpression = findTopMostCallExpression(node)

    return type === 'expect'
      ? parseExpectCallExpression(
          node,
          topMostCallExpression,
          parsedVitestFnCall,
        )
      : parseExpectTypeOfCallExpression(
          node,
          topMostCallExpression,
          parsedVitestFnCall,
        )
  }

  if (
    chain
      .slice(0, chain.length - 1)
      .some((node) => node.parent?.type !== AST_NODE_TYPES.MemberExpression)
  )
    return null

  if (
    node.parent?.type === AST_NODE_TYPES.CallExpression ||
    node.parent?.type === AST_NODE_TYPES.MemberExpression
  )
    return null

  return { ...parsedVitestFnCall, type }
}

const joinChains = (
  a: AccessorNode[] | null,
  b: AccessorNode[] | null,
): AccessorNode[] | null => (a && b ? [...a, ...b] : null)

export function getNodeChain(node: TSESTree.Node): AccessorNode[] | null {
  if (isSupportedAccessor(node)) return [node]

  switch (node.type) {
    case AST_NODE_TYPES.TaggedTemplateExpression:
      return getNodeChain(node.tag)
    case AST_NODE_TYPES.MemberExpression:
      return joinChains(getNodeChain(node.object), getNodeChain(node.property))
    case AST_NODE_TYPES.CallExpression:
      return getNodeChain(node.callee)
  }

  return null
}

const resolveVitestFn = (
  context: TSESLint.RuleContext<string, readonly unknown[]>,
  node: TSESTree.CallExpression,
  identifier: string,
): ResolvedVitestFn | null => {
  const scope = getScope(context, node)
  const maybeImport = resolveScope(scope, identifier)

  if (maybeImport === 'local') return null

  if (maybeImport === 'testContext')
    return {
      local: identifier,
      original: null,
      type: 'testContext',
    }

  if (maybeImport) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const vitestImports = context.settings.vitest?.vitestImports ?? []
    const isVitestImport =
      maybeImport.source === 'vitest' ||
      vitestImports.some((importName: unknown) =>
        importName instanceof RegExp
          ? importName.test(maybeImport.source)
          : maybeImport.source === importName,
      )

    if (isVitestImport) {
      return {
        original: maybeImport.imported,
        local: maybeImport.local,
        type: 'import',
      }
    }
    return null
  }

  return {
    original: resolvePossibleAliasedGlobal(identifier, context),
    local: identifier,
    type: 'global',
  }
}

const resolvePossibleAliasedGlobal = (
  global: string,
  context: TSESLint.RuleContext<string, readonly unknown[]>,
) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const globalAliases = context.settings.vitest?.globalAliases ?? {}

  const alias = Object.entries(globalAliases).find(([_, aliases]) =>
    (aliases as unknown[]).includes(global),
  )

  if (alias) return alias[0]

  return null
}

const isAncestorTestCaseCall = ({ parent }: TSESTree.Node) => {
  return (
    parent?.type === AST_NODE_TYPES.CallExpression &&
    parent.callee.type === AST_NODE_TYPES.Identifier &&
    Object.prototype.hasOwnProperty.call(TestCaseName, parent.callee.name)
  )
}

export const resolveScope = (
  scope: TSESLint.Scope.Scope,
  identifier: string,
): ImportDetails | 'local' | 'testContext' | null => {
  let currentScope: TSESLint.Scope.Scope | null = scope

  while (currentScope !== null) {
    const ref = currentScope.set.get(identifier)

    if (ref && ref.defs.length > 0) {
      const def = ref.defs[ref.defs.length - 1]

      const objectParam = isFunction(def.node)
        ? def.node.params.find(
            (params) => params.type === AST_NODE_TYPES.ObjectPattern,
          )
        : undefined
      if (objectParam) {
        const property = objectParam.properties.find(
          (property) => property.type === AST_NODE_TYPES.Property,
        )
        const key =
          property?.key.type === AST_NODE_TYPES.Identifier
            ? property.key
            : undefined
        if (key?.name === identifier) return 'testContext'
      }

      /** if detect test function is created with `.extend()` */
      if (
        def.node.type === AST_NODE_TYPES.VariableDeclarator &&
        def.node.id.type === AST_NODE_TYPES.Identifier &&
        def.node.init?.type === AST_NODE_TYPES.CallExpression &&
        def.node.init.callee.type === AST_NODE_TYPES.MemberExpression &&
        isIdentifier(def.node.init.callee.property, 'extend')
      ) {
        const baseName = getNodeName(def.node.init.callee.object)
        const rootName = baseName?.split('.')[0]

        if (rootName && rootName !== identifier) {
          const resolved = resolveScope(currentScope, rootName)

          if (
            resolved &&
            typeof resolved === 'object' &&
            Object.hasOwn(TestCaseName, resolved.imported)
          ) {
            return {
              ...resolved,
              local: identifier,
            }
          }
        }
      }
      const namedParam = isFunction(def.node)
        ? def.node.params.find(
            (params) => params.type === AST_NODE_TYPES.Identifier,
          )
        : undefined
      if (namedParam && isAncestorTestCaseCall(namedParam.parent))
        return 'testContext'

      const importDetails = describePossibleImportDef(def)

      if (importDetails?.local === identifier) return importDetails
      return 'local'
    }
    currentScope = currentScope.upper
  }
  return null
}

/**
 * Attempts to find the node that represents the import source for the
 * given expression node, if it looks like it's an import.
 *
 * If no such node can be found (e.g. because the expression doesn't look
 * like an import), then `null` is returned instead.
 */
const findImportSourceNode = (
  node: TSESTree.Expression,
): TSESTree.Node | null => {
  if (node.type === AST_NODE_TYPES.AwaitExpression) {
    if (node.argument.type === AST_NODE_TYPES.ImportExpression)
      return node.argument.source

    return null
  }

  if (
    node.type === AST_NODE_TYPES.CallExpression &&
    isIdentifier(node.callee, 'require')
  )
    return node.arguments[0] ?? null

  return null
}

const describeImportDefAsImport = (
  def: TSESLint.Scope.Definitions.ImportBindingDefinition,
): ImportDetails | null => {
  if (def.parent.type === AST_NODE_TYPES.TSImportEqualsDeclaration) return null

  if (def.node.type !== AST_NODE_TYPES.ImportSpecifier) return null
  if (def.node.imported.type != AST_NODE_TYPES.Identifier) return null

  // we only care about value imports
  if (def.parent.importKind === 'type') return null

  return {
    source: def.parent.source.value,
    imported: def.node.imported.name,
    local: def.node.local.name,
  }
}

const describePossibleImportDef = (def: TSESLint.Scope.Definition) => {
  if (def.type === 'Variable') return describeVariableDefAsImport(def)

  if (def.type === 'ImportBinding') return describeImportDefAsImport(def)

  return null
}

const describeVariableDefAsImport = (
  def: TSESLint.Scope.Definitions.VariableDefinition,
): ImportDetails | null => {
  // make sure that we've actually being assigned a value
  if (!def.node.init) return null

  const sourceNode = findImportSourceNode(def.node.init)

  if (!sourceNode || !isStringNode(sourceNode)) return null

  if (def.name.parent?.type !== AST_NODE_TYPES.Property) return null

  if (!isSupportedAccessor(def.name.parent.key)) return null

  return {
    source: getStringValue(sourceNode),
    imported: getAccessorValue(def.name.parent.key),
    local: def.name.name,
  }
}

export const getTestCallExpressionsFromDeclaredVariables = (
  declaredVariables: readonly TSESLint.Scope.Variable[],
  context: TSESLint.RuleContext<string, readonly unknown[]>,
): TSESTree.CallExpression[] => {
  return declaredVariables.reduce<TSESTree.CallExpression[]>(
    (acc, { references }) =>
      acc.concat(
        references
          .map(({ identifier }) => identifier.parent)
          .filter(
            (node): node is TSESTree.CallExpression =>
              node?.type === AST_NODE_TYPES.CallExpression &&
              isTypeOfVitestFnCall(node, context, ['test']),
          ),
      ),
    [],
  )
}

export const getFirstMatcherArg = (
  expectFnCall: ParsedExpectVitestFnCall,
): TSESTree.SpreadElement | TSESTree.Expression => {
  const [firstArg] = expectFnCall.args

  if (firstArg.type === AST_NODE_TYPES.SpreadElement) return firstArg

  return followTypeAssertionChain(firstArg)
}

interface AsExpressionChain<
  Expression extends TSESTree.Expression = TSESTree.Expression,
>
  extends TSESTree.TSAsExpression {
  expression: AsExpressionChain<Expression> | Expression
}

interface TypeAssertionChain<
  Expression extends TSESTree.Expression = TSESTree.Expression,
>
  extends TSESTree.TSTypeAssertion {
  expression: TypeAssertionChain<Expression> | Expression
}

type TSTypeCastExpression<
  Expression extends TSESTree.Expression = TSESTree.Expression,
> = AsExpressionChain<Expression> | TypeAssertionChain<Expression>

export type MaybeTypeCast<Expression extends TSESTree.Expression> =
  | TSTypeCastExpression<Expression>
  | Expression

const isTypeCastExpression = <Expression extends TSESTree.Expression>(
  node: MaybeTypeCast<Expression>,
): node is TSTypeCastExpression<Expression> =>
  node.type === AST_NODE_TYPES.TSAsExpression ||
  node.type === AST_NODE_TYPES.TSTypeAssertion

export const followTypeAssertionChain = <
  Expression extends TSESTree.Expression,
>(
  expression: MaybeTypeCast<Expression>,
): Expression =>
  isTypeCastExpression(expression)
    ? followTypeAssertionChain(expression.expression)
    : expression
