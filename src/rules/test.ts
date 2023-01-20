// 'CallExpression[callee.name=/^(it|test)$/]'(
//	node: TSESTree.CallExpression
// ) {
//	const { arguments: args } = node

//	// check if there is an expect statement in test body
//	// eslint-disable-next-line @typescript-eslint/no-explicit-any, array-callback-return
//	// TODO: Types this
//	const hasExpect = args.some((arg: any) => {
//		if (args?.body?.body && arg?.body?.body?.isArray()) {
//			// eslint-disable-next-line @typescript-eslint/no-explicit-any, array-callback-return
//			return arg.body.body.some((body: any) => {
//				if (body?.expression?.callee?.object?.callee?.name === 'expect')
//					return true
//			})
//		}
//		return false
//	})

//	if (!hasExpect) {
//		context.report({
//			node,
//			messageId: 'expected-expect'
//		})
//	}
// }
