# Enforce including a hint with external snapshots (`@vitest/prefer-snapshot-hint`)

<!-- end auto-generated rule header -->

When working with external snapshot matchers it's considered best practice to
provide a hint (as the last argument to the matcher) describing the expected
snapshot content that will be included in the snapshots name by Vitest.

This makes it easier for reviewers to verify the snapshots during review, and
for anyone to know whether an outdated snapshot is the correct behavior before
updating.

#### Options

#### `always`

Require a hint _always_ be provided when using external snapshots matchers.

Examples of **incorrect** code for this rule with the `always` option:

```ts
const snapshotOutput = ({ stdout, stderr }) => {
  expect(stdout).toMatchSnapshot();
  expect(stderr).toMatchSnapshot();
};

describe('cli', () => {
  describe('--version flag', () => {
    it('prints the version', async () => {
      snapshotOutput(await runCli(['--version']));
    });
  });

  describe('--config flag', () => {
    it('reads the config', async () => {
      const { stdout, parsedConfig } = await runCli([
        '--config',
        'vitest.config.js',
      ]);

      expect(stdout).toMatchSnapshot();
      expect(parsedConfig).toMatchSnapshot();
    });

    it('prints nothing to stderr', async () => {
      const { stderr } = await runCli(['--config', 'vitest.config.js']);

      expect(stderr).toMatchSnapshot();
    });

    describe('when the file does not exist', () => {
      it('throws an error', async () => {
        await expect(
          runCli(['--config', 'does-not-exist.js']),
        ).rejects.toThrowErrorMatchingSnapshot();
      });
    });
  });
});
```


Examples of **correct** code for this rule with the `always` option:

```ts
const snapshotOutput = ({ stdout, stderr }, hints) => {
  expect(stdout).toMatchSnapshot({}, `stdout: ${hints.stdout}`);
  expect(stderr).toMatchSnapshot({}, `stderr: ${hints.stderr}`);
};

describe('cli', () => {
  describe('--version flag', () => {
    it('prints the version', async () => {
      snapshotOutput(await runCli(['--version']), {
        stdout: 'version string',
        stderr: 'empty',
      });
    });
  });

  describe('--config flag', () => {
    it('reads the config', async () => {
      const { stdout } = await runCli(['--config', 'vitest.config.js']);

      expect(stdout).toMatchSnapshot({}, 'stdout: config settings');
    });

    it('prints nothing to stderr', async () => {
      const { stderr } = await runCli(['--config', 'vitest.config.js']);

      expect(stderr).toMatchInlineSnapshot();
    });

    describe('when the file does not exist', () => {
      it('throws an error', async () => {
        await expect(
          runCli(['--config', 'does-not-exist.js']),
        ).rejects.toThrowErrorMatchingSnapshot('stderr: config error');
      });
    });
  });
});
```


#### `multi` (default)

Examples of **incorrect** code for the `'multi'` option:

```ts
const snapshotOutput = ({ stdout, stderr }) => {
  expect(stdout).toMatchSnapshot();
  expect(stderr).toMatchSnapshot();
};

describe('cli', () => {
  describe('--version flag', () => {
    it('prints the version', async () => {
      snapshotOutput(await runCli(['--version']));
    });
  });

  describe('--config flag', () => {
    it('reads the config', async () => {
      const { stdout, parsedConfig } = await runCli([
        '--config',
        'vitest.config.js',
      ]);

      expect(stdout).toMatchSnapshot();
      expect(parsedConfig).toMatchSnapshot();
    });

    it('prints nothing to stderr', async () => {
      const { stderr } = await runCli(['--config', 'vitest.config.js']);

      expect(stderr).toMatchSnapshot();
    });
  });
});
```

Examples of **correct** code for the `'multi'` option:

```ts
const snapshotOutput = ({ stdout, stderr }, hints) => {
  expect(stdout).toMatchSnapshot({}, `stdout: ${hints.stdout}`);
  expect(stderr).toMatchSnapshot({}, `stderr: ${hints.stderr}`);
};

describe('cli', () => {
  describe('--version flag', () => {
    it('prints the version', async () => {
      snapshotOutput(await runCli(['--version']), {
        stdout: 'version string',
        stderr: 'empty',
      });
    });
  });

  describe('--config flag', () => {
    it('reads the config', async () => {
      const { stdout } = await runCli(['--config', 'vitest.config.js']);

      expect(stdout).toMatchSnapshot();
    });

    it('prints nothing to stderr', async () => {
      const { stderr } = await runCli(['--config', 'vitest.config.js']);

      expect(stderr).toMatchInlineSnapshot();
    });

    describe('when the file does not exist', () => {
      it('throws an error', async () => {
        await expect(
          runCli(['--config', 'does-not-exist.js']),
        ).rejects.toThrowErrorMatchingSnapshot();
      });
    });
  });
});
```
