vi.mock(import('../src/utils/vitest-version'), async (importOriginal) => {
  const original = await importOriginal()
  return {
    ...original,
    determineVitestMajorVersion: vi.fn(
      () => original.BENCHMARK_API_REWRITE_VERSION,
    ),
  }
})
