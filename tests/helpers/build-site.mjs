import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const cwd = process.cwd();
const distDir = join(cwd, 'dist');
const buildMarkerPath = join(distDir, '.test-build-complete');
const buildLockPath = join(cwd, '.test-build-lock');
let builtInProcess = false;

const sleep = (ms) => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
};

const waitForBuild = () => {
  while (!existsSync(buildMarkerPath) && existsSync(buildLockPath)) {
    sleep(100);
  }
};

export function buildSite() {
  if (builtInProcess && existsSync(buildMarkerPath)) {
    return;
  }

  try {
    mkdirSync(buildLockPath);
  } catch (error) {
    if (!existsSync(buildLockPath)) {
      throw error;
    }

    waitForBuild();
    if (!existsSync(buildMarkerPath)) {
      buildSite();
    }
    builtInProcess = true;
    return;
  }

  try {
    if (process.env.FORCE_TEST_BUILD === '1' && !builtInProcess) {
      rmSync(distDir, { recursive: true, force: true });
    }

    if (!existsSync(buildMarkerPath)) {
      execSync('pnpm build', {
        cwd,
        stdio: 'pipe',
        env: { ...process.env, CI: '1' },
      });
      writeFileSync(buildMarkerPath, 'ok\n');
    }

    builtInProcess = true;
  } finally {
    rmSync(buildLockPath, { recursive: true, force: true });
  }
}
