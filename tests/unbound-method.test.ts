import path from 'node:path'
import { RuleTester } from '@typescript-eslint/rule-tester'
import { afterAll, it, describe } from 'vitest'
import unboundMethod from '../src/rules/unbound-method'

const rootPath = path.join(__dirname, './fixtures')

RuleTester.afterAll = afterAll
RuleTester.it = it
RuleTester.itOnly = it.only
RuleTester.describe = describe

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
  invalid: [
    {
      code: `
		class Console {
		  log(str) {
			process.stdout.write(str);
		  }
		}
		
		const console = new Console();
		
		Promise.resolve().then(console.log);
			  `,
      errors: [
        {
          line: 10,
          messageId: 'unboundWithoutThisAnnotation'
        }
      ]
    }
  ]
})
