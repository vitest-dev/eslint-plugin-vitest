/*
 * This script generates all possible permutations for Vitest methods.
 *
 * Run it with `pnpm update:chains`.
 *
 * Originally imported from https://github.com/veritem/eslint-plugin-vitest/pull/293.
 */
import fs from 'node:fs'
import path from 'node:path'

const data = [
  {
    names: ['beforeEach', 'beforeAll', 'afterEach', 'afterAll'],
    first: [],
    exclusive: [],
    conditions: [],
    methods: [],
    last: [],
  },
  {
    names: ['it', 'test'],
    first: [],
    exclusive: ['extend', 'scoped'],
    conditions: ['skipIf', 'runIf'],
    methods: ['skip', 'only', 'concurrent', 'sequential', 'todo', 'fails'],
    last: ['each', 'for'],
  },
  {
    names: ['bench'],
    first: [],
    exclusive: [],
    conditions: ['skipIf', 'runIf'],
    methods: ['skip', 'only', 'todo'],
    last: [],
  },
  {
    names: ['describe', 'suite'],
    first: [],
    exclusive: [],
    conditions: ['skipIf', 'runIf'],
    methods: ['skip', 'only', 'concurrent', 'sequential', 'shuffle', 'todo'],
    last: ['each', 'for'],
  },
]

const DEPTH = 3

const allPermutations: string[] = []

data.forEach((q) => {
  q.names.forEach((name) => {
    allPermutations.push(name)

    allPermutations.push(...q.exclusive.map((p) => [name, p].join('.')))

    const maxDepth = Math.min(DEPTH, q.methods.length)
    const depths = Array.from({ length: maxDepth }, (_, i) => i)
    const methodPerms = depths.flatMap((i) => [
      ...per(q.methods, i + 1),
      ...q.first.flatMap((first) =>
        (per(q.methods, i) || ['']).map((p) => [first, ...p]),
      ),
      ...q.conditions.flatMap((condition) =>
        (per(q.methods, i) || ['']).map((p) => [condition, ...p]),
      ),
      ...q.last.flatMap((last) =>
        (per(q.methods, i) || ['']).map((p) => [...p, last]),
      ),
      ...(i > 0
        ? q.first.flatMap((first) =>
            q.conditions.flatMap((condition) =>
              (per(q.methods, i - 1) || ['']).map((p) => [
                first,
                condition,
                ...p,
              ]),
            ),
          )
        : []),
      ...(i > 0
        ? q.first.flatMap((first) =>
            q.last.flatMap((last) =>
              (per(q.methods, i - 1) || ['']).map((p) => [first, ...p, last]),
            ),
          )
        : []),
      ...(i > 0
        ? q.conditions.flatMap((condition) =>
            q.last.flatMap((last) =>
              (per(q.methods, i - 1) || ['']).map((p) => [
                condition,
                ...p,
                last,
              ]),
            ),
          )
        : []),
      ...(i > 1
        ? q.first.flatMap((first) =>
            q.conditions.flatMap((condition) =>
              q.last.flatMap((last) =>
                (per(q.methods, i - 2) || ['']).map((p) => [
                  first,
                  condition,
                  ...p,
                  last,
                ]),
              ),
            ),
          )
        : []),
    ])
    allPermutations.push(...methodPerms.map((p) => [name, ...p].join('.')))
  })
})

const extraRules = [
  'xtest',
  'xtest.each',
  'xit',
  'xit.each',
  'fit',
  'xdescribe',
  'xdescribe.each',
  'fdescribe',
]

const output = `export const ValidVitestFnCallChains = new Set([${allPermutations.concat(extraRules).map((item) => `'${item}'`)}])`

const newPath = path.resolve(
  import.meta.dirname,
  '../src/utils/valid-vitest-fn-call-chains.ts',
)

fs.writeFileSync(newPath, output)
console.log(
  `done writing to ${newPath.split('/')[newPath.split('/').length - 1]}`,
)

// Based on https://github.com/kota-yata/Percom/blob/master/src/permutation.js (MIT licensed)
function calcPer<T>(
  array: T[],
  num: number,
  current: T[] = [],
  result: T[][] = [],
) {
  if (current.length >= num) return null
  let tempCurrent = current.slice(0, current.length)
  for (let i = 0; i < array.length; i++) {
    tempCurrent.push(array[i])
    const slicedArray = array.filter((_, index) => index !== i)
    const returned = calcPer(slicedArray, num, tempCurrent, result)
    if (returned === null) result.push(tempCurrent)
    tempCurrent = current.slice(0, current.length)
  }
  return result
}
/**
 * Permutation
 * @param array - Target array
 * @param num - Number of elements in a permutation
 * @return Return all permutations
 * @example
 * const result = per([1, 2, 3], 2);
 * //result = [ [ 1, 2 ], [ 1, 3 ], [ 2, 1 ], [ 2, 3 ], [ 3, 1 ], [ 3, 2 ] ]
 */
function per<T>(array: T[], num: number) {
  if (array.length < num)
    throw new Error(
      'Number of elements of array must be greater than number to choose',
    )
  return calcPer(array, num) as T[][]
}
