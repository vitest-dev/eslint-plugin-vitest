import path from 'node:path'
import { RuleTester } from '@typescript-eslint/rule-tester'
import { afterAll, describe, it } from 'vitest'
import unboundMethod from './unbound-method'

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it

const rootPath = path.join(__dirname, 'fixtures')

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
	tsconfigRootDir: rootPath,
	project: './tsconfig.json',
	sourceType: 'module'
  }
})

ruleTester.run('unbound-method', unboundMethod, {
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
	logManualBind();`
  ],
  invalid: []
})
