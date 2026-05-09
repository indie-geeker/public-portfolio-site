import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildSite } from './helpers/build-site.mjs';

const cwd = process.cwd();
const distDir = join(cwd, 'dist');
const rssPath = join(distDir, 'rss.xml');
const hiddenTemplateDetailPath = join(
  distDir,
  'blog',
  'article-template',
  'index.html',
);
const hiddenChineseTemplateDetailPath = join(
  distDir,
  'blog',
  'chinese-article-template',
  'index.html',
);
const draftSlug = 'future-draft-feed-fixture';
const draftSourcePath = join(
  cwd,
  'src',
  'content',
  'blog',
  `${draftSlug}.md`,
);
const draftDetailPath = join(distDir, 'blog', draftSlug, 'index.html');

writeFileSync(
  draftSourcePath,
  `---
title: "Future Draft Feed Fixture"
description: "Temporary draft content for RSS regression coverage"
publishDate: 2099-01-01
featured: false
featuredOrder: 999
draft: true
---

This draft entry should never be built publicly or emitted into RSS.
`,
  'utf8',
);

try {
  buildSite();
} finally {
  rmSync(draftSourcePath, { force: true });
}

test('blog build does not publish hidden template routes', () => {
  assert.equal(existsSync(hiddenTemplateDetailPath), false);
  assert.equal(existsSync(hiddenChineseTemplateDetailPath), false);
});

test('rss excludes hidden and draft blog entries while keeping publish dates', () => {
  const rssXml = readFileSync(rssPath, 'utf8');

  assert.doesNotMatch(rssXml, /article-template/);
  assert.doesNotMatch(rssXml, /chinese-article-template/);
  assert.doesNotMatch(rssXml, /Future Draft Feed Fixture/);
  assert.doesNotMatch(rssXml, /future-draft-feed-fixture/);
  assert.match(rssXml, /<pubDate>.*GMT<\/pubDate>/);
});

test('draft blog entries do not generate public detail routes', () => {
  assert.equal(existsSync(draftDetailPath), false);
});
