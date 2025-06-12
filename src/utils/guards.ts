import { TSESTree } from "@typescript-eslint/utils";
import { VITEST_GLOBALS } from "./valid-vitest-globals";

export const isVitestGlobalsImportSpecifier = (specifier: TSESTree.ImportClause): specifier is TSESTree.ImportSpecifier & { imported: TSESTree.Identifier } => {
    return (
        specifier.type === TSESTree.AST_NODE_TYPES.ImportSpecifier &&
        specifier.imported.type === TSESTree.AST_NODE_TYPES.Identifier &&
        VITEST_GLOBALS.has(specifier.imported.name)
    );
}
