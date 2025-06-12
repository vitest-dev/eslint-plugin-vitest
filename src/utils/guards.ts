import { TSESTree } from "@typescript-eslint/utils";
import { VITEST_GLOBALS } from "./valid-vitest-globals";

export const isVitestGlobalsImportSpecifier = (specifier: TSESTree.ImportClause): specifier is TSESTree.ImportSpecifier & { imported: TSESTree.Identifier } => {
    return (
        specifier.type === TSESTree.AST_NODE_TYPES.ImportSpecifier &&
        specifier.imported.type === TSESTree.AST_NODE_TYPES.Identifier &&
        VITEST_GLOBALS.has(specifier.imported.name)
    );
}

export const isVitestGlobalsProperty = (prop: TSESTree.Property | TSESTree.RestElement): prop is TSESTree.Property & { key: TSESTree.Identifier } => {
    return (
        prop.type === TSESTree.AST_NODE_TYPES.Property &&
        prop.key.type === TSESTree.AST_NODE_TYPES.Identifier &&
        VITEST_GLOBALS.has(prop.key.name)
    );
};

export const isRequireVitestCall = (node: TSESTree.Expression | null): node is TSESTree.CallExpression => {
    if (
        node?.type !== TSESTree.AST_NODE_TYPES.CallExpression ||
        node.callee.type !== TSESTree.AST_NODE_TYPES.Identifier ||
        node.callee.name !== 'require'
    ) {
        return false;
    }

    const args = node.arguments;
    return (
        args.length === 1 &&
        args[0].type === TSESTree.AST_NODE_TYPES.Literal &&
        args[0].value === 'vitest'
    );
};

export const isObjectPattern = (node: TSESTree.BindingName): node is TSESTree.ObjectPattern => {
    return node.type === TSESTree.AST_NODE_TYPES.ObjectPattern;
};
