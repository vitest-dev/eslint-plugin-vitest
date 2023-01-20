import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils'
import { DescribeAlias, TestCaseName } from './types'
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

interface ParsedExpectVitestFnCall extends BaseParsedJestFnCall, ModifiersAndMatcher {
	type: 'expect'
}

export type ParsedVitestFnCall = ParsedGeneralVitestFnCall | ParsedExpectVitestFnCall

export const isTypeOfVitestFnCall = (
	node: TSESTree.CallExpression,
	context: TSESLint.RuleContext<string, unknown[]>,
	types: VitestFnType[]
) => {
	const vitestFnCall = parseVitestFnCall(node, context)
	return vitestFnCall !== null && types.includes(vitestFnCall)
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
	ParsedVitestFnCall | string
>()

export const parseVitestFnCallWithReason = (
	node: TSESTree.CallExpression,
	context: TSESLint.RuleContext<string, unknown[]>
) => {
	const parsedVistestFnCall = parseVitestFnCallCache.get(node)

	if (parseVitestFnCall)
		return parseVitestFnCall

	parseVitestFnCall = parseVistestFnCallWithReasonInner(node, context)

	parseVitestFnCallCache.set(node, parseVitestFnCall)

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
	}
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
		// TODO: @veritem check if source is vitest global
		// console.log(maybeImport.source)
		// return {
		//	original: maybeImport.imported,
		//	local: maybeImport.local,
		//	type: 'import'
		// }
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
