// imported from https://github.com/veritem/eslint-plugin-vitest/pull/293
// This script generates all possible permutations for vitest methods
import { per } from "percom";

const data = [
  {
    names: ["beforeEach", "beforeAll", "afterEach", "afterAll"],
    first: [],
    conditions: [],
    methods: [],
    last: [],
  },
  {
    names: ["it", "test"],
    first: ["extend"],
    conditions: ["skipIf", "runIf"],
    methods: ["skip", "only", "concurrent", "sequential", "todo", "fails"],
    last: ["each"],
  },
  {
    names: ["bench"],
    first: [],
    conditions: ["skipIf", "runIf"],
    methods: ["skip", "only", "todo"],
    last: [],
  },
  {
    names: ["describe"],
    first: [],
    conditions: ["skipIf", "runIf"],
    methods: ["skip", "only", "concurrent", "sequential", "shuffle", "todo"],
    last: ["each"],
  },
];

const DEPTH = 3;

const allPermutations = [];

const join = (methods) => methods.filter((method) => !!method).join(".");
const depths = (maxDepth) => Array.from({ length: maxDepth }, (_, i) => i);

data.forEach((q) => {
  q.names.map((name) => {
    allPermutations.push(name);

    const maxDepth = Math.min(DEPTH, q.methods.length);
    const methodPerms = depths(maxDepth).flatMap((i) => [
      ...per(q.methods, i + 1),
      ...q.first.flatMap((first) =>
        (per(q.methods, i) || [""]).map((p) => [first, ...p])
      ),
      ...q.conditions.flatMap((condition) =>
        (per(q.methods, i) || [""]).map((p) => [condition, ...p])
      ),
      ...q.last.flatMap((last) =>
        (per(q.methods, i) || [""]).map((p) => [...p, last])
      ),
      ...(i > 0
        ? q.first.flatMap((first) =>
            q.conditions.flatMap((condition) =>
              (per(q.methods, i - 1) || [""]).map((p) => [
                first,
                condition,
                ...p,
              ])
            )
          )
        : []),
      ...(i > 0
        ? q.first.flatMap((first) =>
            q.last.flatMap((last) =>
              (per(q.methods, i - 1) || [""]).map((p) => [first, ...p, last])
            )
          )
        : []),
      ...(i > 0
        ? q.conditions.flatMap((condition) =>
            q.last.flatMap((last) =>
              (per(q.methods, i - 1) || [""]).map((p) => [
                condition,
                ...p,
                last,
              ])
            )
          )
        : []),
      ...(i > 1
        ? q.first.flatMap((first) =>
            q.conditions.flatMap((condition) =>
              q.last.flatMap((last) =>
                (per(q.methods, i - 2) || [""]).map((p) => [
                  first,
                  condition,
                  ...p,
                  last,
                ])
              )
            )
          )
        : []),
    ]);
    const allPerms = methodPerms.map((p) => [name, ...p].join("."));
    allPermutations.push(...allPerms);
  });
});

console.log(allPermutations);
