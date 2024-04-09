import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import rule, { RULE_NAME } from '../src/rules/prefer-spy-on'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'Date.now = () => 10',
    'window.fetch = vi.fn',
    'Date.now = fn()',
    'obj.mock = vi.something()',
    'const mock = vi.fn()',
    'mock = vi.fn()',
    'const mockObj = { mock: vi.fn() }',
    'mockObj = { mock: vi.fn() }',
    // eslint-disable-next-line no-template-curly-in-string
    'window[`${name}`] = vi[`fn${expression}`]()'
  ],
  invalid: [
    {
      code: 'obj.a = vi.fn(); const test = 10;',
      output: 'vi.spyOn(obj, \'a\').mockImplementation(); const test = 10;',
      errors: [
        {
          messageId: 'useViSpayOn',
          type: AST_NODE_TYPES.AssignmentExpression
        }
      ]
    },
    {
      code: 'Date[\'now\'] = vi[\'fn\']()',
      output: 'vi.spyOn(Date, \'now\').mockImplementation()',
      errors: [
        {
          messageId: 'useViSpayOn',
          type: AST_NODE_TYPES.AssignmentExpression
        }
      ]
    },
    {
      // eslint-disable-next-line no-template-curly-in-string
      code: 'window[`${name}`] = vi[`fn`]()',
      // eslint-disable-next-line no-template-curly-in-string
      output: 'vi.spyOn(window, `${name}`).mockImplementation()',
      errors: [
        {
          messageId: 'useViSpayOn',
          type: AST_NODE_TYPES.AssignmentExpression
        }
      ]
    },
    {
      code: 'obj[\'prop\' + 1] = vi[\'fn\']()',
      output: 'vi.spyOn(obj, \'prop\' + 1).mockImplementation()',
      errors: [
        {
          messageId: 'useViSpayOn',
          type: AST_NODE_TYPES.AssignmentExpression
        }
      ]
    },
    {
      code: 'obj.one.two = vi.fn(); const test = 10;',
      output: 'vi.spyOn(obj.one, \'two\').mockImplementation(); const test = 10;',
      errors: [
        {
          messageId: 'useViSpayOn',
          type: AST_NODE_TYPES.AssignmentExpression
        }
      ]
    },
    {
      code: 'obj.a = vi.fn(() => 10,)',
      output: 'vi.spyOn(obj, \'a\').mockImplementation(() => 10)',
      parserOptions: { ecmaVersion: 2017 },
      errors: [
        {
          messageId: 'useViSpayOn',
          type: AST_NODE_TYPES.AssignmentExpression
        }
      ]
    },
    {
      code: 'obj.a.b = vi.fn(() => ({})).mockReturnValue(\'default\').mockReturnValueOnce(\'first call\'); test();',
      output:
        'vi.spyOn(obj.a, \'b\').mockImplementation(() => ({})).mockReturnValue(\'default\').mockReturnValueOnce(\'first call\'); test();',
      errors: [
        {
          messageId: 'useViSpayOn',
          type: AST_NODE_TYPES.AssignmentExpression
        }
      ]
    },
    {
      code: 'window.fetch = vi.fn(() => ({})).one.two().three().four',
      output:
        'vi.spyOn(window, \'fetch\').mockImplementation(() => ({})).one.two().three().four',
      errors: [
        {
          messageId: 'useViSpayOn',
          type: AST_NODE_TYPES.AssignmentExpression
        }
      ]
    },
    {
      code: 'foo[bar] = vi.fn().mockReturnValue(undefined)',
      output:
        'vi.spyOn(foo, bar).mockImplementation().mockReturnValue(undefined)',
      errors: [
        {
          messageId: 'useViSpayOn',
          type: AST_NODE_TYPES.AssignmentExpression
        }
      ]
    },
    {
      code: `
        foo.bar = vi.fn().mockImplementation(baz => baz)
        foo.bar = vi.fn(a => b).mockImplementation(baz => baz)
      `,
      output: `
        vi.spyOn(foo, 'bar').mockImplementation(baz => baz)
        vi.spyOn(foo, 'bar').mockImplementation(baz => baz)
      `,
      errors: [
        {
          messageId: 'useViSpayOn',
          type: AST_NODE_TYPES.AssignmentExpression
        },
        {
          messageId: 'useViSpayOn',
          type: AST_NODE_TYPES.AssignmentExpression
        }
      ]
    }
  ]
})
