import { findPackageJSON } from 'node:module'
import fs from 'node:fs'

export const LEGACY_BENCHMARK_VERSION = 4
export const BENCHMARK_API_REWRITE_VERSION = 5
const majorVersionCache = new Map<string, number>()
export const determineVitestMajorVersion = (filepath: string) => {
  if (majorVersionCache.has(filepath)) {
    return majorVersionCache.get(filepath)!
  }
  const vitestPackageJsonPath = findPackageJSON('vitest', filepath)
  const vitestPackage = JSON.parse(
    fs.readFileSync(vitestPackageJsonPath!, 'utf-8'),
  )

  const majorVersion = Number.parseInt(
    (vitestPackage.version as string).split('.')[0],
    10,
  )
  majorVersionCache.set(filepath, majorVersion)
  return majorVersion
}
