import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildSite } from './helpers/build-site.mjs';

const cwd = process.cwd();
const distDir = join(cwd, 'dist');
const homepagePath = join(distDir, 'index.html');
const aboutPagePath = join(distDir, 'about', 'index.html');
const heroSourcePath = join(cwd, 'src', 'components', 'home', 'Hero.astro');
const navSourcePath = join(cwd, 'src', 'components', 'Nav.astro');
const editorialFixtureSlug = 'featured-articles-order-fixture';
const editorialFixtureSourcePath = join(
  cwd,
  'src',
  'content',
  'blog',
  `${editorialFixtureSlug}.md`,
);
const articleTemplatePath = join(cwd, 'src', 'content', 'blog', 'article-template.md');
const chineseTemplatePath = join(
  cwd,
  'src',
  'content',
  'blog',
  'chinese-article-template.md',
);

writeFileSync(
  editorialFixtureSourcePath,
  `---
title: "Newest Non-Featured Article"
description: "Visible fixture used to verify editorial featured ordering"
publishDate: 2025-06-01
featured: false
featuredOrder: 999
draft: false
---

This fixture should appear after explicitly featured entries on the homepage.
`,
  'utf8',
);

try {
  buildSite();
} finally {
  rmSync(editorialFixtureSourcePath, { force: true });
}

test('homepage build includes product-led hero and follow section', () => {
  const html = readFileSync(homepagePath, 'utf8');

  assert.match(html, /独立极客/);
  assert.match(html, /精选产品/);
  assert.match(html, /follow-heading/);
  assert.match(html, /js-hero-avatar/);
  assert.match(html, /data-nav-avatar/);
  assert.match(html, /customElements\.get\(["']menu-button["']\)/);
  assert.doesNotMatch(html, /avatar-home-mode/);
  assert.doesNotMatch(html, />\s*DESIGN\s*</);
  assert.doesNotMatch(html, />\s*SKILL\s*</);
  assert.doesNotMatch(html, />\s*NEED3D\s*</);
  assert.match(html, /avatar--home-hidden/);
  assert.match(html, /avatar--revealed/);
  assert.match(html, /data-nav-avatar-sentinel/);
  assert.match(html, /updateNavAvatarVisibility/);
  assert.match(html, /IntersectionObserver/);
  assert.match(html, /data-scroll-glass-nav/);
  assert.match(html, /--nav-scroll-progress/);
  assert.match(html, /window\.scrollY/);
  assert.match(html, /document\.body\.scrollTop/);
  assert.match(html, /hero-overlap/);
});

test('homepage hero viewport sizing compensates for its navigation overlap', () => {
  const heroSource = readFileSync(heroSourcePath, 'utf8');

  assert.match(
    heroSource,
    /min-height:\s*calc\(100vh \+ var\(--hero-overlap\) - var\(--size-top, 64px\)\)/,
  );
  assert.match(
    heroSource,
    /min-height:\s*calc\(100svh \+ var\(--hero-overlap\) - var\(--size-top, 64px\)\)/,
  );
});

test('navigation box uses the shared top-size token at every viewport', () => {
  const navSource = readFileSync(navSourcePath, 'utf8');

  assert.match(
    navSource,
    /nav\s*\{[\s\S]*?min-height:\s*var\(--size-top, 64px\);[\s\S]*?display:\s*flex;/,
  );
  assert.match(navSource, /\.nav-wrapper\s*\{[\s\S]*?width:\s*100%;/);
});

test('homepage identity typewriter advances without deleting the display line to empty', () => {
  const heroSource = readFileSync(heroSourcePath, 'utf8');
  const classMatch = heroSource.match(
    /class Typewriter\s*\{[\s\S]*?\n  \}\n\n  const initHeroBehavior/,
  );

  assert.ok(classMatch, 'expected the inline Typewriter class to be present');
  const classSource = classMatch[0].replace(/\n\n  const initHeroBehavior$/, '');
  const Typewriter = Function(`${classSource}; return Typewriter;`)();
  const scheduled = [];
  const cleared = [];
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;
  const originalSetInterval = globalThis.setInterval;
  const originalClearInterval = globalThis.clearInterval;

  globalThis.setTimeout = (callback, delay) => {
    const id = scheduled.length + 1;
    scheduled.push({ id, callback, delay });
    return id;
  };
  globalThis.clearTimeout = (id) => cleared.push(id);
  globalThis.setInterval = globalThis.setTimeout;
  globalThis.clearInterval = globalThis.clearTimeout;

  try {
    const span = { textContent: '' };
    const typewriter = new Typewriter(span, ['AB', 'CD'], 2500);

    assert.equal(span.textContent, 'A');
    let task = scheduled.shift();
    assert.equal(task.delay, 100);

    task.callback();
    assert.equal(span.textContent, 'AB');
    task = scheduled.shift();
    assert.equal(task.delay, 2500);

    task.callback();
    assert.equal(span.textContent, 'A');
    task = scheduled.shift();
    assert.equal(task.delay, 500);

    task.callback();
    assert.equal(span.textContent, 'C');

    typewriter.setWords(['XY']);
    assert.equal(span.textContent, 'X');
    assert.ok(cleared.length > 0);
  } finally {
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
    globalThis.setInterval = originalSetInterval;
    globalThis.clearInterval = originalClearInterval;
  }
});

test('homepage featured articles prefer explicit featured entries over newer fallback posts', () => {
  const html = readFileSync(homepagePath, 'utf8');
  const featuredArticleIndex = html.indexOf('(MDX)网页CSS文字渐变精选');
  const newestFallbackIndex = html.indexOf('Newest Non-Featured Article');

  assert.notEqual(featuredArticleIndex, -1);
  assert.notEqual(newestFallbackIndex, -1);
  assert.ok(
    featuredArticleIndex < newestFallbackIndex,
    'expected explicitly featured article to render before newer non-featured content',
  );
});

test('blog templates document editorial featured and draft frontmatter fields', () => {
  const articleTemplate = readFileSync(articleTemplatePath, 'utf8');
  const chineseTemplate = readFileSync(chineseTemplatePath, 'utf8');

  assert.match(articleTemplate, /featured:\s*false/);
  assert.match(articleTemplate, /featuredOrder:\s*999/);
  assert.match(articleTemplate, /draft:\s*false/);
  assert.match(chineseTemplate, /featured:\s*false/);
  assert.match(chineseTemplate, /featuredOrder:\s*999/);
  assert.match(chineseTemplate, /draft:\s*false/);
});

test('homepage build disables the global particle trail only while the pointer is inside the hero', () => {
  const html = readFileSync(homepagePath, 'utf8');

  assert.match(html, /data-particle-gate-start/);
  assert.match(html, /pathname === ['"]\/['"]/);
  assert.match(html, /setParticleGateEnabled/);
  assert.match(html, /querySelector\(['"]\.home-hero['"]\)/);
  assert.match(html, /pointer\.x >= heroRect\.left/);
  assert.match(html, /pointer\.y <= heroRect\.bottom/);
});

test('shared nav build emits scroll-driven glass hooks on non-home pages', () => {
  const html = readFileSync(aboutPagePath, 'utf8');

  assert.match(html, /data-scroll-glass-nav/);
  assert.match(html, /--nav-scroll-progress/);
  assert.match(html, /window\.scrollY/);
  assert.match(html, /document\.body\.scrollTop/);
  assert.match(html, /nav--scrolled/);
});
