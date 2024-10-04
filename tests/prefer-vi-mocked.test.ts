import rule, { RULE_NAME } from "../src/rules/prefer-vi-mocked";
import { ruleTester } from "./ruleTester";

ruleTester.run(RULE_NAME, rule, {
  valid: [
    "foo();",
    "vi.mocked(foo).mockReturnValue(1);",
    "bar.mockReturnValue(1);",
    "sinon.stub(foo).returns(1);",
    "foo.mockImplementation(() => 1);",
    "obj.foo();",
    "mockFn.mockReturnValue(1);",
    "arr[0]();",
    "obj.foo.mockReturnValue(1);",
    'vi.spyOn(obj, "foo").mockReturnValue(1);',
    "(foo as Mock.vi).mockReturnValue(1);",
    `type MockType = Mock;
const mockFn = vi.fn();
(mockFn as MockType).mockReturnValue(1);`,
  ],
  invalid: [
    {
      code: "(foo as Mock).mockReturnValue(1);",
      output: "(vi.mocked(foo)).mockReturnValue(1);",
      errors: [{ messageId: "useViMocked" }],
    },
    {
      code: "(foo as unknown as string as unknown as Mock).mockReturnValue(1);",
      output: "(vi.mocked(foo)).mockReturnValue(1);",
      errors: [{ messageId: "useViMocked" }],
    },
    {
      code: "(foo as unknown as Mock as unknown as Mock).mockReturnValue(1);",
      output: "(vi.mocked(foo)).mockReturnValue(1);",
      errors: [{ messageId: "useViMocked" }],
    },
    {
      code: "(<Mock>foo).mockReturnValue(1);",
      output: "(vi.mocked(foo)).mockReturnValue(1);",
      errors: [{ messageId: "useViMocked" }],
    },
    {
      code: "(foo as Mock).mockImplementation(1);",
      output: "(vi.mocked(foo)).mockImplementation(1);",
      errors: [{ messageId: "useViMocked" }],
    },
    {
      code: "(foo as unknown as Mock).mockReturnValue(1);",
      output: "(vi.mocked(foo)).mockReturnValue(1);",
      errors: [{ messageId: "useViMocked" }],
    },
    {
      code: "(<Mock>foo as unknown).mockReturnValue(1);",
      output: "(vi.mocked(foo) as unknown).mockReturnValue(1);",
      errors: [{ messageId: "useViMocked" }],
    },
    {
      code: "(Obj.foo as Mock).mockReturnValue(1);",
      output: "(vi.mocked(Obj.foo)).mockReturnValue(1);",
      errors: [{ messageId: "useViMocked" }],
    },
    {
      code: "([].foo as Mock).mockReturnValue(1);",
      output: "(vi.mocked([].foo)).mockReturnValue(1);",
      errors: [{ messageId: "useViMocked" }],
    },
    {
      code: "(foo as MockedFunction).mockReturnValue(1);",
      output: "(vi.mocked(foo)).mockReturnValue(1);",
      errors: [{ messageId: "useViMocked" }],
    },
    {
      code: "(foo as MockedFunction).mockImplementation(1);",
      output: "(vi.mocked(foo)).mockImplementation(1);",
      errors: [{ messageId: "useViMocked" }],
    },
    {
      code: "(foo as unknown as MockedFunction).mockReturnValue(1);",
      output: "(vi.mocked(foo)).mockReturnValue(1);",
      errors: [{ messageId: "useViMocked" }],
    },
    {
      code: "(Obj.foo as MockedFunction).mockReturnValue(1);",
      output: "(vi.mocked(Obj.foo)).mockReturnValue(1);",
      errors: [{ messageId: "useViMocked" }],
    },
    {
      code: "(new Array(0).fill(null).foo as MockedFunction).mockReturnValue(1);",
      output: "(vi.mocked(new Array(0).fill(null).foo)).mockReturnValue(1);",
      errors: [{ messageId: "useViMocked" }],
    },
    {
      code: "(vi.fn(() => foo) as MockedFunction).mockReturnValue(1);",
      output: "(vi.mocked(vi.fn(() => foo))).mockReturnValue(1);",
      errors: [{ messageId: "useViMocked" }],
    },
    {
      code: "const mockedUseFocused = useFocused as MockedFunction<typeof useFocused>;",
      output: "const mockedUseFocused = vi.mocked(useFocused);",
      errors: [{ messageId: "useViMocked" }],
    },
    {
      code: "const filter = (MessageService.getMessage as Mock).mock.calls[0][0];",
      output:
        "const filter = (vi.mocked(MessageService.getMessage)).mock.calls[0][0];",
      errors: [{ messageId: "useViMocked" }],
    },
    {
      code: `class A {}
(foo as MockedClass<A>)`,
      output: `class A {}
(vi.mocked(foo))`,
      errors: [{ messageId: "useViMocked" }],
    },
    {
      code: "(foo as MockedObject<{method: () => void}>)",
      output: "(vi.mocked(foo))",
      errors: [{ messageId: "useViMocked" }],
    },
    {
      code: '(Obj["foo"] as MockedFunction).mockReturnValue(1);',
      output: '(vi.mocked(Obj["foo"])).mockReturnValue(1);',
      errors: [{ messageId: "useViMocked" }],
    },
    {
      code: `(
new Array(100)
  .fill(undefined)
  .map(x => x.value)
  .filter(v => !!v).myProperty as MockedFunction<{
  method: () => void;
}>
).mockReturnValue(1);`,
      output: `(
vi.mocked(new Array(100)
  .fill(undefined)
  .map(x => x.value)
  .filter(v => !!v).myProperty)
).mockReturnValue(1);`,
      errors: [{ messageId: "useViMocked" }],
    },
  ],
});
