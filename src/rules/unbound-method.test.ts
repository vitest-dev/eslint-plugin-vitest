import { ESLintUtils } from "@typescript-eslint/utils";
import unboundMethod from "./unbound-method";

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    project: "./tsconfig.json",
  },
});

ruleTester.run("unbound-method", unboundMethod, {
  valid: [
    `class MyClass {
		public logArrowBound = (): void => {
			console.log(bound);
		};
	
		public logManualBind(): void {
			console.log(this);
		}
	}
	
	const instance = new MyClass();
	const logArrowBound = instance.logArrowBound;
	const logManualBind = instance.logManualBind.bind(instance);
	
	logArrowBound();
	logManualBind();`,
  ],
  invalid: [],
});
