import path from 'node:path'
import { RuleTester } from '@typescript-eslint/rule-tester'
import unboundMethod from '../src/rules/unbound-method'

const rootPath = path.join(__dirname, './fixtures')

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: rootPath,
      project: './tsconfig.json',
      sourceType: 'module',
    },
  },
})

ruleTester.run('unbound-method', unboundMethod, {
  valid: [
    {
      code: `class MyClass {
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
      skip: true,
    },
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
      skip: true,
      errors: [
        {
          line: 10,
          messageId: 'unboundWithoutThisAnnotation',
        },
      ],
    },
  ],
})
