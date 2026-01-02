import rule from '../src/rules/prefer-snapshot-hint'
import { ruleTester } from './ruleTester'

ruleTester.run(rule.name, rule, {
  valid: [
    {
      code: 'expect(something).toStrictEqual(somethingElse);',
      options: ['multi'],
    },
    {
      code: "a().toEqual('b')",
      options: ['multi'],
    },
    {
      code: 'expect(a);',
      options: ['multi'],
    },
    {
      code: 'expect(1).toMatchSnapshot({}, "my snapshot");',
      options: ['multi'],
    },
    {
      code: 'expect(1).toThrowErrorMatchingSnapshot("my snapshot");',
      options: ['multi'],
    },
    {
      code: 'expect(1).toMatchSnapshot({});',
      options: ['multi'],
    },
    {
      code: 'expect(1).toThrowErrorMatchingSnapshot();',
      options: ['multi'],
    },
    {
      code: `
       it('is true', () => {
      expect(1).toMatchSnapshot();
       });
     `,
      options: ['multi'],
    },
    {
      code: `
       it('is true', () => {
      expect(1).toMatchSnapshot(undefined, 'my first snapshot');
       });
     `,
      options: ['multi'],
    },
    {
      code: `
       describe('my tests', () => {
      it('is true', () => {
        expect(1).toMatchSnapshot('this is a hint, all by itself');
      });
     
      it('is false', () => {
        expect(2).toMatchSnapshot('this is a hint');
        expect(2).toMatchSnapshot('and so is this');
      });
       });
     `,
      options: ['multi'],
    },
    {
      code: `
       it('is true', () => {
      expect(1).toMatchSnapshot();
       });
     
       it('is false', () => {
      expect(2).toMatchSnapshot('this is a hint');
      expect(2).toMatchSnapshot('and so is this');
       });
     `,
      options: ['multi'],
    },
    {
      code: `
       it('is true', () => {
      expect(1).toMatchSnapshot();
       });
     
       it('is false', () => {
      expect(2).toThrowErrorMatchingSnapshot();
       });
     `,
      options: ['multi'],
    },
    {
      code: `
       it('is true', () => {
      expect(1).toStrictEqual(1);
      expect(1).toStrictEqual(2);
      expect(1).toMatchSnapshot();
       });
     
       it('is false', () => {
      expect(1).toStrictEqual(1);
      expect(1).toStrictEqual(2);
      expect(2).toThrowErrorMatchingSnapshot();
       });
     `,
      options: ['multi'],
    },
    {
      code: `
       it('is true', () => {
      expect(1).toMatchInlineSnapshot();
       });
     
       it('is false', () => {
      expect(1).toMatchInlineSnapshot();
      expect(1).toMatchInlineSnapshot();
      expect(1).toThrowErrorMatchingInlineSnapshot();
       });
     `,
      options: ['multi'],
    },
    {
      code: `
       it('is true', () => {
      expect(1).toMatchSnapshot();
       });
     
       it('is false', () => {
      expect(1).toMatchSnapshot();
       });
     `,
      options: ['multi'],
    },
    {
      code: `
       const myReusableTestBody = (value, snapshotHint) => {
      const innerFn = anotherValue => {
        expect(anotherValue).toMatchSnapshot();
     
        expect(value).toBe(1);
      };
     
      expect(value).toBe(1);
       };
     
       it('my test', () => {
      expect(1).toMatchSnapshot();
       });
     `,
      options: ['multi'],
    },
    {
      code: `
       const myReusableTestBody = (value, snapshotHint) => {
      const innerFn = anotherValue => {
        expect(value).toBe(1);
      };
     
      expect(value).toBe(1);
      expect(anotherValue).toMatchSnapshot();
       };
     
       it('my test', () => {
      expect(1).toMatchSnapshot();
       });
     `,
      options: ['multi'],
    },
    {
      code: `
       const myReusableTestBody = (value, snapshotHint) => {
      const innerFn = anotherValue => {
        expect(anotherValue).toMatchSnapshot();
     
        expect(value).toBe(1);
      };
     
      expect(value).toBe(1);
       };
     
       expect(1).toMatchSnapshot();
     `,
      options: ['multi'],
    },
  ],
  invalid: [
    {
      code: `it('is true', () => {
      expect(1).toMatchSnapshot();
      expect(2).toMatchSnapshot();
       });
     `,
      options: ['multi'],
      errors: [
        {
          messageId: 'missingHint',
          column: 17,
          line: 2,
        },
        {
          messageId: 'missingHint',
          column: 17,
          line: 3,
        },
      ],
    },
    {
      code: `it('is true', () => {
        expect(1).toMatchSnapshot();
        expect(2).toThrowErrorMatchingSnapshot();
      });
       `,
      options: ['multi'],
      errors: [
        {
          messageId: 'missingHint',
          column: 19,
          line: 2,
        },
        {
          messageId: 'missingHint',
          column: 19,
          line: 3,
        },
      ],
    },
    {
      code: `it('is true', () => {
        expect(1).toThrowErrorMatchingSnapshot();
        expect(2).toMatchSnapshot();
      });
       `,
      options: ['multi'],
      errors: [
        {
          messageId: 'missingHint',
          column: 19,
          line: 2,
        },
        {
          messageId: 'missingHint',
          column: 19,
          line: 3,
        },
      ],
    },
    {
      code: `it('is true', () => {
        expect(1).toMatchSnapshot({});
        expect(2).toMatchSnapshot({});
      });
       `,
      options: ['multi'],
      errors: [
        {
          messageId: 'missingHint',
          column: 19,
          line: 2,
        },
        {
          messageId: 'missingHint',
          column: 19,
          line: 3,
        },
      ],
    },
    {
      code: `it('is true', () => {
       expect(1).toMatchSnapshot({});
       {
      expect(2).toMatchSnapshot({});
       }
     });
      `,
      options: ['multi'],
      errors: [
        {
          messageId: 'missingHint',
          column: 18,
          line: 2,
        },
        {
          messageId: 'missingHint',
          column: 17,
          line: 4,
        },
      ],
    },
    {
      code: `it('is true', () => {
       { expect(1).toMatchSnapshot(); }
       { expect(2).toMatchSnapshot(); }
     });
      `,
      options: ['multi'],
      errors: [
        {
          messageId: 'missingHint',
          column: 20,
          line: 2,
        },
        {
          messageId: 'missingHint',
          column: 20,
          line: 3,
        },
      ],
    },
    {
      code: `it('is true', () => {
        expect(1).toMatchSnapshot();
        expect(2).toMatchSnapshot(undefined, 'my second snapshot');
      });
       `,
      options: ['multi'],
      errors: [
        {
          messageId: 'missingHint',
          column: 19,
          line: 2,
        },
      ],
    },
    {
      code: `it('is true', () => {
        expect(1).toMatchSnapshot({});
        expect(2).toMatchSnapshot(undefined, 'my second snapshot');
      });`,
      options: ['multi'],
      errors: [
        {
          messageId: 'missingHint',
          column: 19,
          line: 2,
        },
      ],
    },
    {
      code: `it('is true', () => {
        expect(1).toMatchSnapshot({}, 'my first snapshot');
        expect(2).toMatchSnapshot(undefined);
      });
       `,
      options: ['multi'],
      errors: [
        {
          messageId: 'missingHint',
          column: 19,
          line: 3,
        },
      ],
    },
    {
      code: `it('is true', () => {
        expect(1).toMatchSnapshot({}, 'my first snapshot');
        expect(2).toMatchSnapshot(undefined);
        expect(2).toMatchSnapshot();
      });
       `,
      options: ['multi'],
      errors: [
        {
          messageId: 'missingHint',
          column: 19,
          line: 3,
        },
        {
          messageId: 'missingHint',
          column: 19,
          line: 4,
        },
      ],
    },
    {
      code: `it('is true', () => {
        expect(2).toMatchSnapshot();
        expect(1).toMatchSnapshot({}, 'my second snapshot');
        expect(2).toMatchSnapshot();
      });
       `,
      options: ['multi'],
      errors: [
        {
          messageId: 'missingHint',
          column: 19,
          line: 2,
        },
        {
          messageId: 'missingHint',
          column: 19,
          line: 4,
        },
      ],
    },
    {
      code: `it('is true', () => {
        expect(2).toMatchSnapshot(undefined);
        expect(2).toMatchSnapshot();
        expect(1).toMatchSnapshot(null, 'my third snapshot');
      });
       `,
      options: ['multi'],
      errors: [
        {
          messageId: 'missingHint',
          column: 19,
          line: 2,
        },
        {
          messageId: 'missingHint',
          column: 19,
          line: 3,
        },
      ],
    },
    {
      code: `describe('my tests', () => {
        it('is true', () => {
       expect(1).toMatchSnapshot();
        });
 
        it('is false', () => {
       expect(2).toMatchSnapshot();
       expect(2).toMatchSnapshot();
        });
      });
       `,
      options: ['multi'],
      errors: [
        {
          messageId: 'missingHint',
          column: 18,
          line: 7,
        },
        {
          messageId: 'missingHint',
          column: 18,
          line: 8,
        },
      ],
    },
    {
      code: `describe('my tests', () => {
        it('is true', () => {
       expect(1).toMatchSnapshot();
        });
 
        it('is false', () => {
       expect(2).toMatchSnapshot();
       expect(2).toMatchSnapshot('hello world');
        });
      });
       `,
      options: ['multi'],
      errors: [
        {
          messageId: 'missingHint',
          column: 18,
          line: 7,
        },
      ],
    },
    {
      code: `describe('my tests', () => {
        describe('more tests', () => {
       it('is true', () => {
         expect(1).toMatchSnapshot();
       });
        });
 
        it('is false', () => {
       expect(2).toMatchSnapshot();
       expect(2).toMatchSnapshot('hello world');
        });
      });
       `,
      options: ['multi'],
      errors: [
        {
          messageId: 'missingHint',
          column: 18,
          line: 9,
        },
      ],
    },
  ],
})
