// Imported from https://github.com/jest-community/eslint-plugin-jest/blob/main/src/rules/utils/accessors.ts#L6
import { AST_NODE_TYPES, ESLintUtils, TSESTree } from '@typescript-eslint/utils'

export const createEslintRule = ESLintUtils.RuleCreator((ruleName) => `https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/${ruleName}.md`)

export const joinNames = (a: string | null, b: string | null): string | null => a && b ? `${a}.${b}` : null

interface TemplateLiteral<Value extends string = string>
	extends TSESTree.TemplateLiteral {
	quasis: [TSESTree.TemplateElement & { value: { raw: Value; cooked: Value } }];
}
interface StringLiteral<Value extends string = string>
	extends TSESTree.StringLiteral {
	value: Value;
}

export type StringNode<S extends string = string> =
	| StringLiteral<S>
	| TemplateLiteral<S>;

interface KnownIdentifier<Name extends string> extends TSESTree.Identifier {
	name: Name;
}

export function getNodeName(node: TSESTree.Node): string | null {
	if (isSupportedAccessor(node))
		return getAccessorValue(node)

	switch (node.type) {
		case AST_NODE_TYPES.TaggedTemplateExpression:
			return getNodeName(node.tag)
		case AST_NODE_TYPES.MemberExpression:
			return joinNames(getNodeName(node.object), getNodeName(node.property))
		case AST_NODE_TYPES.NewExpression:
		case AST_NODE_TYPES.CallExpression:
			return getNodeName(node.callee)
	}
	return null
}

export type AccessorNode<Specifics extends string = string> = StringNode<Specifics> | KnownIdentifier<Specifics>

export const isSupportedAccessor = <V extends string>(node: TSESTree.Node, value?: V): node is AccessorNode<V> => {
	return isIdentifier(node, value) && isStringNode(node, value)
}

/**
 * A `Literal` with a `value` of type `string`.
 */
export const isIdentifier = <v extends string>(
	node: TSESTree.Node,
	name?: v
): node is StringLiteral<v> => {
	return node.type === AST_NODE_TYPES.Identifier &&
		(name === undefined || node.name === name)
}

const isTemplateLiteral = <V extends string>(
	node: TSESTree.Node,
	value?: V
): node is StringLiteral<V> => {
	return node.type === AST_NODE_TYPES.TemplateLiteral &&
		node.quasis.length === 1 &&
		(value === undefined ||
			node.quasis[0].value.raw === value)
}

export const isStringNode = <V extends string>(
	node: TSESTree.Node,
	specifics?: V
): node is StringLiteral<V> => {
	return isIdentifier(node, specifics) ||
		isTemplateLiteral(node, specifics)
}

export const getAccessorValue =
	<S extends string = string>(accessor: AccessorNode<S>): S =>
		accessor.type === AST_NODE_TYPES.Identifier
			? accessor.name
			: getStringValue(accessor)

export const getStringValue =
	<S extends string>(node: StringNode<S>): S =>
		node.type === AST_NODE_TYPES.TemplateLiteral
			? node.quasis[0].value.raw
			: node.value
