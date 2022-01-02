module.exports = {
    rules: {
       "async-func-name": {
            create: function (context) {
                return {
                    FunctionDeclaration (node) {
                        if (node.async && !/Async$/.test(node.id.name)) {
                            context.report({
                                node,
                                message: "Async function must end with an async"
                            })
                        }
                    }
                }
            }
       }
    }
}
