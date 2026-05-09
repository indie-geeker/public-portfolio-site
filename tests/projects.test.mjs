import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildSite } from './helpers/build-site.mjs';

const cwd = process.cwd();
const distDir = join(cwd, 'dist');
const projectPagePath = join(distDir, 'project', 'index.html');
const gradientsHubDetailPath = join(distDir, 'detail', 'gradientshub', 'index.html');
const todoDetailPath = join(distDir, 'detail', 'todo', 'index.html');
const tinklifeDetailPath = join(distDir, 'detail', 'tinklife', 'index.html');
const valentinesDetailPath = join(
  distDir,
  'detail',
  'free-3d-valentines-assets',
  'index.html',
);
const todoContentPath = join(cwd, 'src', 'content', 'projects', 'todo', 'index.mdx');
const tinklifeContentPath = join(cwd, 'src', 'content', 'projects', 'tinklife', 'index.mdx');
const valentinesContentPath = join(
  cwd,
  'src',
  'content',
  'projects',
  'free-3d-valentines-assets',
  'index.mdx',
);
const gradientsHubContentPath = join(
  cwd,
  'src',
  'content',
  'projects',
  'gradientshub',
  'index.mdx',
);
const ricoOgGalleryContentPath = join(
  cwd,
  'src',
  'content',
  'projects',
  'rico-og-gallery',
  'index.mdx',
);
const uiuxdeckContentPath = join(
  cwd,
  'src',
  'content',
  'projects',
  'uiuxdeck',
  'index.mdx',
);
const todoLegacyPagePath = join(cwd, 'src', 'pages', 'detail', 'todo.astro');
const tinklifeLegacyPagePath = join(cwd, 'src', 'pages', 'detail', 'tinklife.astro');
const valentinesLegacyPagePath = join(
  cwd,
  'src',
  'pages',
  'detail',
  'free-3d-valentines-assets.astro',
);
const contentConfigPath = join(cwd, 'src', 'content', 'config.ts');
buildSite();

test('project index includes collection-backed live products', () => {
  const html = readFileSync(projectPagePath, 'utf8');

  assert.match(html, /GradientsHub/);
  assert.match(html, /UIUX 设计工具(?:&|&amp;)资源库/);
  assert.match(html, /Rico OG Gallery/);
  assert.match(html, /detail\/gradientshub/);
});

test('build generates a detail page for the gradientshub project entry', () => {
  assert.equal(existsSync(gradientsHubDetailPath), true);

  const html = readFileSync(gradientsHubDetailPath, 'utf8');
  assert.match(html, /GradientsHub/);
  assert.match(html, /立即体验|访问站点/);
});

test('legacy project detail entries are served by the dynamic route without compatibility fields', () => {
  assert.equal(existsSync(todoDetailPath), true);
  assert.equal(existsSync(tinklifeDetailPath), true);
  assert.equal(existsSync(valentinesDetailPath), true);
  assert.equal(existsSync(todoLegacyPagePath), false);
  assert.equal(existsSync(tinklifeLegacyPagePath), false);
  assert.equal(existsSync(valentinesLegacyPagePath), false);

  const todoContent = readFileSync(todoContentPath, 'utf8');
  const tinklifeContent = readFileSync(tinklifeContentPath, 'utf8');
  const valentinesContent = readFileSync(valentinesContentPath, 'utf8');

  assert.doesNotMatch(todoContent, /detailUrl:/);
  assert.doesNotMatch(tinklifeContent, /detailUrl:/);
  assert.doesNotMatch(valentinesContent, /detailUrl:/);
});

test('project content co-locates media entries and keeps image output in the build', () => {
  const contentConfig = readFileSync(contentConfigPath, 'utf8');
  const todoContent = readFileSync(todoContentPath, 'utf8');
  const tinklifeContent = readFileSync(tinklifeContentPath, 'utf8');
  const valentinesContent = readFileSync(valentinesContentPath, 'utf8');
  const gradientsHubContent = readFileSync(gradientsHubContentPath, 'utf8');
  const ricoOgGalleryContent = readFileSync(ricoOgGalleryContentPath, 'utf8');
  const uiuxdeckContent = readFileSync(uiuxdeckContentPath, 'utf8');
  const todoHtml = readFileSync(todoDetailPath, 'utf8');
  const projectHtml = readFileSync(projectPagePath, 'utf8');

  assert.match(contentConfig, /schema:\s*\(\{\s*image\s*\}\)\s*=>\s*z\.object\(/);
  assert.match(contentConfig, /cover:\s*image\(\)/);
  assert.match(contentConfig, /gallery:\s*z\.array\(image\(\)\)/);

  for (const content of [
    todoContent,
    tinklifeContent,
    valentinesContent,
    gradientsHubContent,
    ricoOgGalleryContent,
    uiuxdeckContent,
  ]) {
    assert.match(content, /cover:\s*"\.\//);
  }

  for (const content of [todoContent, tinklifeContent, valentinesContent]) {
    assert.match(content, /gallery:\s*\n(?:\s+-\s*"\.\/[^\n]+"\n?)+/);
  }

  assert.match(todoHtml, /<img/);
  assert.match(projectHtml, /<img/);
});
