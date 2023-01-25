import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils'
import { DescribeAlias, ModifierName, TestCaseName } from './types'
import { AccessorNode, getAccessorValue, getStringValue, isIdentifier, isStringNode, isSupportedAccessor } from '.'

const ValidVitestFnCallChains = [
	'afterAll',
	'afterEach',
	'beforeAll',
	'beforeEach',
	'describe',
	'describe.each',
	'describe.only',
	'describe.only.each',
	'describe.skip',
	'describe.skip.each',
	'fdescribe',
	'fdescribe.each',
	'xdescribe',
	'xdescribe.each',
	'it',
	'it.concurrent',
	'it.concurrent.each',
	'it.concurrent.only.each',
	'it.concurrent.skip.each',
	'it.each',
	'it.failing',
	'it.only',
	'it.only.each',
	'it.only.failing',
	'it.skip',
	'it.skip.each',
	'it.skip.failing',
	'it.todo',
	'fit',
	'fit.each',
	'fit.failing',
	'xit',
	'xit.each',
	'xit.failing',
	'test',
	'test.concurrent',
	'test.concurrent.each',
	'test.concurrent.only.each',
	'test.concurrent.skip.each',
	'test.each',
	'test.failing',
	'test.only',
	'test.only.each',
	'test.only.failing',
	'test.skip',
	'test.skip.each',
	'test.skip.failing',
	'test.todo',
	'xtest',
	'xtest.each',
	'xtest.failing'
]

export type VitestFnType =
	| 'test'
	| 'it'
	| 'describe'
	| 'expect'
	| 'unknown'

interface ResolvedVitestFn {
	original: string | null,
	local: string,
	type: 'import' | 'global',
}

interface ImportDetails {
	source: string;
	local: string;
	imported: string;
}

export interface ResolvedVitestFnWithNode extends ResolvedVitestFn {
	node: AccessorNode
}

export interface KnownMemberExpression<Name extends string = string>
	extends TSESTree.MemberExpressionComputedName {
	property: AccessorNode<Name>
}

type KnownMemberExpressionProperty<Specifies extends string = string> = AccessorNode<Specifies> & { parent: KnownMemberExpression<Specifies> }

interface ModifiersAndMatcher {
	modifiers: KnownMemberExpressionProperty[];
	matcher: KnownMemberExpressionProperty;
	/** The arguments that are being passed to the `matcher` */
	args: TSESTree.CallExpression['arguments'];
}

interface BaseParsedJestFnCall {
	/**
	 * The name of the underlying Vitest function that is being called.
	 * This is the result of `(head.original ?? head.local)`.
	 */
	name: string;
	type: VitestFnType;
	head: ResolvedVitestFnWithNode;
	members: KnownMemberExpressionProperty[];
}

interface ParsedGeneralVitestFnCall extends BaseParsedJestFnCall {
	type: Exclude<VitestFnType, 'expect'>
}

export interface ParsedExpectVitestFnCall extends BaseParsedJestFnCall, ModifiersAndMatcher {
	type: 'expect'
}

export type ParsedVitestFnCall = ParsedGeneralVitestFnCall | ParsedExpectVitestFnCall

export const isTypeOfVitestFnCall = (
	node: TSESTree.CallExpression,
	context: TSESLint.RuleContext<string, unknown[]>,
	types: VitestFnType[]
) => {
	const vitestFnCall = parseVitestFnCall(node, context)
	return vitestFnCall !== null && types.includes(vitestFnCall.type)
}

export const parseVitestFnCall = (
	node: TSESTree.CallExpression,
	context: TSESLint.RuleContext<string, unknown[]>
) => {
	const vitestFnCall = parseVitestFnCallWithReason(node, context)

	if (typeof vitestFnCall === 'string')
		return null

	return vitestFnCall
}

const parseVitestFnCallCache = new WeakMap<
	TSESTree.CallExpression,
	ParsedVitestFnCall | string | null
>()

export const parseVitestFnCallWithReason = (
	node: TSESTree.CallExpression,
	context: TSESLint.RuleContext<string, unknown[]>
) => {
	let parsedVistestFnCall = parseVitestFnCallCache.get(node)

	if (parsedVistestFnCall)
		return parsedVistestFnCall

	parsedVistestFnCall = parseVistestFnCallWithReasonInner(node, context)

	parseVitestFnCallCache.set(node, parsedVistestFnCall)

	return parsedVistestFnCall
}

const determineVitestFnType = (name: string): VitestFnType => {
	if (name === 'expect')
		return 'expect'

	// eslint-disable-next-line no-prototype-builtins
	if (DescribeAlias.hasOwnProperty(name))
		return 'describe'

	// eslint-disable-next-line no-prototype-builtins
	if (TestCaseName.hasOwnProperty(name))
		return 'test'

	return 'unknown'
}

const findModifiersAndMatcher = (
	members: KnownMemberExpressionProperty[]
): ModifiersAndMatcher | string => {
	const modifiers: KnownMemberExpressionProperty[] = []

	for (const member of members) {
		// check if the member is being called, which means it is the matcher
		// (and also the end of the entire "expect" call chain)
		if (
			member.parent?.type === AST_NODE_TYPES.MemberExpression &&
			member.parent.parent?.type === AST_NODE_TYPES.CallExpression
		) {
			return {
				matcher: member,
				args: member.parent.parent.arguments,
				modifiers
			}
		}

		// otherwise, it should be a modifier
		const name = getAccessorValue(member)

		if (modifiers.length === 0) {
			// the first modifier can be any of the three modifiers
			// eslint-disable-next-line no-prototype-builtins
			if (!ModifierName.hasOwnProperty(name))
				return 'modifier-unknown'
		} else if (modifiers.length === 1) {
			// the second modifier can only be "not"
			if (name !== ModifierName.not)
				return 'modifier-unknown'

			const firstModifier = getAccessorValue(modifiers[0])

			// and the first modifier has to be either "resolves" or "rejects"
			if (
				firstModifier !== ModifierName.resolves &&
				firstModifier !== ModifierName.rejects
			)
				return 'modifier-unknown'
		} else {
			return 'modifier-unknown'
		}

		modifiers.push(member)
	}

	// this will only really happen if there are no members
	return 'matcher-not-found'
}

const parseVitestExpectCall = (typelessParsedVitestFnCall: Omit<ParsedVitestFnCall, 'type'>): ParsedExpectVitestFnCall | string => {
	const modifiersMatcher = findModifiersAndMatcher(typelessParsedVitestFnCall.members)

	if (typeof modifiersMatcher === 'string')
		return modifiersMatcher

	return {
		...typelessParsedVitestFnCall,
		type: 'expect',
		...modifiersMatcher
	}
}

export const findTopMostCallExpression = (
	node: TSESTree.CallExpression
): TSESTree.CallExpression => {
	let topMostCallExpression = node
	let { parent } = node

	while (parent) {
		if (parent.type === AST_NODE_TYPES.CallExpression) {
			topMostCallExpression = parent

			parent = parent.parent

			continue
		}

		if (parent.type !== AST_NODE_TYPES.MemberExpression)
			break

		parent = parent.parent
	}

	return topMostCallExpression
}

const parseVistestFnCallWithReasonInner = (
	node: TSESTree.CallExpression,
	context: TSESLint.RuleContext<string, unknown[]>
): ParsedVitestFnCall | string | null => {
	const chain = getNodeChain(node)

	if (!chain?.length)
		return null

	const [first, ...rest] = chain

	const lastLink = getAccessorValue(chain[chain.length - 1])

	if (lastLink === 'each') {
		if (node.callee.type !== AST_NODE_TYPES.CallExpression &&
			node.callee.type !== AST_NODE_TYPES.TaggedTemplateExpression)
			return null
	}

	if (node.callee.type === AST_NODE_TYPES.TaggedTemplateExpression && lastLink !== 'each')
		return null

	const resolved = resolveVitestFn(context, getAccessorValue(first))

	// this is not a jest function
	if (!resolved)
		return null

	const name = resolved.original ?? resolved.local

	const links = [name, ...rest.map(getAccessorValue)]

	if (name !== 'expect' && !ValidVitestFnCallChains.includes(links.join('.')))
		return null

	const parsedVitestFnCall: Omit<ParsedVitestFnCall, 'type'> = {
		name,
		head: { ...resolved, node: first },
		members: rest as KnownMemberExpressionProperty[]
	}

	const type = determineVitestFnType(name)

	if (type === 'expect') {
		const result = parseVitestExpectCall(parsedVitestFnCall)

		if (typeof result === 'string' && findTopMostCallExpression(node) !== node)
			return null

		if (result === 'matcher-not-found') {
			if (node.parent?.type === AST_NODE_TYPES.MemberExpression)
				return 'matcher-not-called'
		}
		return result
	}

	if (chain
		.slice(0, chain.length - 1)
		.some(node => node.parent?.type !== AST_NODE_TYPES.MemberExpression))
		return null

	if (node.parent?.type === AST_NODE_TYPES.CallExpression ||
		node.parent?.type === AST_NODE_TYPES.MemberExpression)
		return null

	return { ...parsedVitestFnCall, type }
}

const joinChains = (
	a: AccessorNode[] | null,
	b: AccessorNode[] | null
): AccessorNode[] | null => (a && b ? [...a, ...b] : null)

export function getNodeChain(node: TSESTree.Node): AccessorNode[] | null {
	if (isSupportedAccessor(node))
		return [node]

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

interface ResolvedVitestFnType {
	original: string | null,
	local: string,
	type: 'import' | 'global',
}

const resolveVitestFn = (
	context: TSESLint.RuleContext<string, unknown[]>,
	identifier: string
): ResolvedVitestFnType | null => {
	const maybeImport = resolveScope(context.getScope(), identifier)

	if (maybeImport === 'local')
		return null

	if (maybeImport) {
		if (maybeImport.source === 'vitest') {
			return {
				original: maybeImport.imported,
				local: maybeImport.local,
				type: 'import'
			}
		}
		return null
	}

	return {
		original: resolvePossibleAliasedGlobal(identifier, context),
		local: identifier,
		type: 'global'
	}
}

const resolvePossibleAliasedGlobal = (
	global: string,
	context: TSESLint.RuleContext<string, unknown[]>
) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const globalAliases = context.settings.vitest?.globalAliases ?? {}

	const alias = Object.entries(globalAliases).find(([_, aliases]) => (aliases as unknown[]).includes(global))

	if (alias)
		return alias[0]

	return null
}

export const resolveScope = (
	scope: TSESLint.Scope.Scope,
	identifier: string
): ImportDetails | 'local' | null => {
	let currentScope: TSESLint.Scope.Scope | null = scope

	while (currentScope !== null) {
		const ref = currentScope.set.get(identifier)

		if (ref && ref.defs.length > 0) {
			const def = ref.defs[ref.defs.length - 1]

			const importDetails = describePossibleImportDef(def)

			if (importDetails?.local === identifier)
				return importDetails
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
	node: TSESTree.Expression
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
	def: TSESLint.Scope.Definitions.ImportBindingDefinition
): ImportDetails | null => {
	if (def.parent.type === AST_NODE_TYPES.TSImportEqualsDeclaration)
		return null

	if (def.node.type !== AST_NODE_TYPES.ImportSpecifier)
		return null

	// we only care about value imports
	if (def.parent.importKind === 'type')
		return null

	return {
		source: def.parent.source.value,
		imported: def.node.imported.name,
		local: def.node.local.name
	}
}

const describePossibleImportDef = (def: TSESLint.Scope.Definition) => {
	if (def.type === 'Variable')
		return describeVariableDefAsImport(def)

	if (def.type === 'ImportBinding')
		return describeImportDefAsImport(def)

	return null
}

const describeVariableDefAsImport = (
	def: TSESLint.Scope.Definitions.VariableDefinition
): ImportDetails | null => {
	// make sure that we've actually being assigned a value
	if (!def.node.init)
		return null

	const sourceNode = findImportSourceNode(def.node.init)

	if (!sourceNode || !isStringNode(sourceNode))
		return null

	if (def.name.parent?.type !== AST_NODE_TYPES.Property)
		return null

	if (!isSupportedAccessor(def.name.parent.key))
		return null

	return {
		source: getStringValue(sourceNode),
		imported: getAccessorValue(def.name.parent.key),
		local: def.name.name
	}
}

export const getTestCallExpressionsFromDeclaredVariables = (
	declaredVariables: readonly TSESLint.Scope.Variable[],
	context: TSESLint.RuleContext<string, unknown[]>
): TSESTree.CallExpression[] => {
	return declaredVariables.reduce<TSESTree.CallExpression[]>(
		(acc, { references }) =>
			acc.concat(
				references
					.map(({ identifier }) => identifier.parent)
					.filter(
						(node): node is TSESTree.CallExpression =>
							node?.type === AST_NODE_TYPES.CallExpression &&
							isTypeOfVitestFnCall(node, context, ['test'])
					)
			),
		[]
	)
}

export const getFirstMatcherArg = (
	expectFnCall: ParsedExpectVitestFnCall
): TSESTree.SpreadElement | TSESTree.Expression => {
	const [firstArg] = expectFnCall.args

	if (firstArg.type === AST_NODE_TYPES.SpreadElement)
		return firstArg

	return followTypeAssertionChain(firstArg)
}

interface AsExpressionChain<
	Expression extends TSESTree.Expression = TSESTree.Expression,
> extends TSESTree.TSAsExpression {
	expression: AsExpressionChain<Expression> | Expression;
}

interface TypeAssertionChain<
	Expression extends TSESTree.Expression = TSESTree.Expression,
> extends TSESTree.TSTypeAssertion {
	expression: TypeAssertionChain<Expression> | Expression;
}

type TSTypeCastExpression<
	Expression extends TSESTree.Expression = TSESTree.Expression,
> = AsExpressionChain<Expression> | TypeAssertionChain<Expression>;

export type MaybeTypeCast<Expression extends TSESTree.Expression> =
	| TSTypeCastExpression<Expression>
	| Expression;

const isTypeCastExpression = <Expression extends TSESTree.Expression>(
	node: MaybeTypeCast<Expression>
): node is TSTypeCastExpression<Expression> =>
	node.type === AST_NODE_TYPES.TSAsExpression ||
	node.type === AST_NODE_TYPES.TSTypeAssertion

export const followTypeAssertionChain = <Expression extends TSESTree.Expression>(
	expression: MaybeTypeCast<Expression>
): Expression => isTypeCastExpression(expression)
		? followTypeAssertionChain(expression.expression)
		: expression
