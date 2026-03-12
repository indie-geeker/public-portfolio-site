import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const cwd = process.cwd();
const distDir = join(cwd, 'dist');
const projectPagePath = join(distDir, 'project', 'index.html');
const gradientsHubDetailPath = join(distDir, 'detail', 'gradientshub', 'index.html');

function buildSite() {
  rmSync(distDir, { recursive: true, force: true });
  execSync('pnpm build', {
    cwd,
    stdio: 'pipe',
    env: { ...process.env, CI: '1' },
  });
}

test('project index includes collection-backed live products', () => {
  buildSite();
  const html = readFileSync(projectPagePath, 'utf8');

  assert.match(html, /GradientsHub/);
  assert.match(html, /UIUX 设计工具&资源库/);
  assert.match(html, /Rico OG Gallery/);
  assert.match(html, /detail\/gradientshub/);
});

test('build generates a detail page for the gradientshub project entry', () => {
  buildSite();

  assert.equal(existsSync(gradientsHubDetailPath), true);

  const html = readFileSync(gradientsHubDetailPath, 'utf8');
  assert.match(html, /GradientsHub/);
  assert.match(html, /立即体验|访问站点/);
});
