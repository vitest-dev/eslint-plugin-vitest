function isDescribeCall(node) {}

// export default createRule({
//     name: __filename,
//     meta: {
//         docs: {
//             category: "",
//             description: "Require test cases and hooks to be inside a `describe` block",
//             recommended: false
//         },
//         type: "suggestion",
//         schema: [
//             {
//                 type: "object",
//                 properties: {
//                     maxNumberOfTopLevelDescribes: {
//                         type: 'number',
//                         minimum: 1
//                     }
//                 },
//                 additionalProperties: false
//             }
//         ]
//     },
//     defaultOptions: [{}],
//     create(context) {
//         // const {maxNumberOfTopLevelDescribes = Infinity} = context.options[0] ?? {};

//         let numberOfTopLevelDescribeBlocks  = 0;
//         let numberOfDescribeBlocks = 0;

//         return {
//             // CallExpression(node){
//             //     if(isDescribeCall(node)){
//             //     context.report({
//             //         node,
//             //         messageId: "tooManyDescribes",
//             //         data: {
//             //             max: maxNumberOfTopLevelDescribes,
//             //             s: maxNumberOfTopLevelDescribes == 1 ? '' : 's'
//             //         }
//             //     })
//             //     }
//             //     return
//             // }

//             // if(numberOfDescribeBlocks == 0){
//             //     if(){

//             //     }
//             // }

//         }
//     }
// })
