import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildSite } from './helpers/build-site.mjs';

const cwd = process.cwd();
const distDir = join(cwd, 'dist');

buildSite();

const readPage = (...segments) =>
  readFileSync(join(distDir, ...segments, 'index.html'), 'utf8');

test('the static shell initializes and exposes the bilingual locale contract', () => {
  const html = readPage();

  assert.match(html, /<html[^>]+lang="en"[^>]+data-locale="en"/);
  assert.match(html, /site-locale/);
  assert.match(html, /Asia\/Shanghai/);
  assert.match(html, /zh-CN/);
  assert.match(html, /data-locale-option="zh-CN"/);
  assert.match(html, /data-locale-option="en"/);
  assert.match(html, /site:locale-change/);
});

test('core page headings and placeholder states are available in both languages', () => {
  const homeHtml = readPage();
  const projectHtml = readPage('project');
  const blogHtml = readPage('blog');
  const aboutHtml = readPage('about');

  assert.match(homeHtml, /精选产品/);
  assert.match(homeHtml, /Featured products/);
  assert.match(homeHtml, /概念占位/);
  assert.match(homeHtml, /Concept placeholder/);
  assert.match(homeHtml, /即将开放/);
  assert.match(homeHtml, /Coming soon/);

  assert.match(projectHtml, /<h1/);
  assert.match(projectHtml, /项目实验室/);
  assert.match(projectHtml, /Project lab/);
  assert.match(projectHtml, /概念项目/);
  assert.match(projectHtml, /Concept project/);

  assert.match(blogHtml, /<h1/);
  assert.match(blogHtml, /写作与笔记/);
  assert.match(blogHtml, /Writing (?:&|&amp;|&#38;) notes/);

  assert.match(aboutHtml, /<h1/);
  assert.match(aboutHtml, /关于这间独立工作室/);
  assert.match(aboutHtml, /About this indie studio/);
});

test('the shared document shell provides semantic navigation and preview metadata', () => {
  const html = readPage();

  assert.match(html, /href="#main-content"/);
  assert.match(html, /<main[^>]+id="main-content"/);
  assert.match(html, /<link[^>]+rel="canonical"/);
  assert.match(html, /property="og:title"/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /name="twitter:card"/);
  assert.doesNotMatch(html, /user-scalable=no/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /aria-label="[^"]*(?:切换主题|Toggle theme)[^"]*"/);
});

test('decorative motion respects reduced-motion and coarse-pointer environments', () => {
  const html = readPage();

  assert.match(html, /prefers-reduced-motion/);
  assert.match(html, /pointer:\s*coarse/);
  assert.match(html, /particles\.length === 0/);
});
