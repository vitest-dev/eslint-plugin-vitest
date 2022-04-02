import { createEslintRule } from "../utils";

export type MessageIds = 'noSkippedTests';
export const RULE_NAME = 'no-skipped-tests';
export type Options = []

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description: "Disallow skipped tests",
      recommended: "error",
    },
    fixable: 'code',
    schema: [],
    messages: {
      noSkippedTests: "Skipped tests are not allowed.",
    }
  },
  defaultOptions: [],
  create: (context) => {
    let suiteDepth = 0;
    let testDepth = 0;

    return {
      'CallExpression[callee.name="describe"]'() {
        suiteDepth++;
      },
      'CallExpression[callee.name=/^(it|test)$/]'() {
        testDepth++;
      },
      'CallExpression[callee.name=/^(it|test)$/][arguments.length<2]'(node) {
        context.report({ messageId: "noSkippedTests", node });
      },
      CallExpression(node) {


        //@ts-ignore
        const functionName = (node.callee.name || '').toLowerCase()

        // prevent duplicate warnings for it.each()()
        if (node.callee.type === 'CallExpression') {
          return;
        }

        //TODO test for skipped tests 

        console.log(functionName)

        switch (functionName) {
          case 'describe.skip.each':
          case 'xdescribe.each':
          case 'describe.skip':
            context.report({ messageId: "noSkippedTests", node });
            break;
          case 'it.skip':
          case 'it.concurrent.skip':
          case 'test.skip':
          case 'test.concurrent.skip':
          case 'it.skip.each':
          case 'test.skip.each':
          case 'xit.each':
          case 'xtest.each':
            context.report({ messageId: "noSkippedTests", node });
            break;
        }
      },
      'CallExpression[callee.name="xdescribe"]'(node) {
        context.report({ messageId: "noSkippedTests", node });
      },
      'CallExpression[callee.name=/^(xit|xtest)$/]'(node) {
        context.report({ messageId: "noSkippedTests", node });
      },
      'CallExpression[callee.name="describe"]:exit'() {
        suiteDepth--;
      },
      'CallExpression[callee.name=/^(it|test)$/]:exit'() {
        testDepth--;
      },
    }
  }
})
