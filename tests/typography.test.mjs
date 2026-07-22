import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const cwd = process.cwd();
const readSource = (...segments) =>
  readFileSync(join(cwd, ...segments), 'utf8');

const globalStyles = readSource('src', 'styles', 'global.scss');
const pageIntroSource = readSource('src', 'components', 'PageIntro.astro');
const heroSource = readSource('src', 'components', 'home', 'Hero.astro');
const homepageSource = readSource('src', 'pages', 'index.astro');
const aboutSource = readSource('src', 'pages', 'about.astro');
const homeSectionSources = [
  'FeaturedProducts.astro',
  'LatestNotes.astro',
  'MiniAbout.astro',
  'FollowSection.astro',
].map((filename) =>
  readSource('src', 'components', 'home', filename),
);

test('global design tokens define a restrained responsive display scale', () => {
  assert.match(
    globalStyles,
    /--font-size-page-title:\s*clamp\(2\.75rem, 7vw, 5\.5rem\);/,
  );
  assert.match(
    globalStyles,
    /--font-size-page-title-zh:\s*clamp\(2\.5rem, 6\.5vw, 5rem\);/,
  );
  assert.match(
    globalStyles,
    /--font-size-hero-title:\s*clamp\(2\.5rem, 5vw, 4\.5rem\);/,
  );
  assert.match(
    globalStyles,
    /--font-size-section-title:\s*clamp\(1\.75rem, 3\.5vw, 2\.75rem\);/,
  );
  assert.match(
    globalStyles,
    /--space-home-section:\s*clamp\(2\.25rem, 5vw, 4rem\);/,
  );
});

test('shared page intro balances wrapping and optically corrects Chinese titles', () => {
  assert.match(pageIntroSource, /font-size:\s*var\(--font-size-page-title\);/);
  assert.match(pageIntroSource, /text-wrap:\s*balance;/);
  assert.match(
    pageIntroSource,
    /:global\(html\[data-locale='zh-CN'\]\) h1\s*\{[\s\S]*?max-width:\s*100%;[\s\S]*?font-size:\s*var\(--font-size-page-title-zh\);[\s\S]*?line-height:\s*1\.04;[\s\S]*?letter-spacing:\s*-0\.015em;/,
  );
});

test('display headings balance multi-line text instead of leaving short orphan lines', () => {
  assert.match(
    globalStyles,
    /h1,[\s\S]*?h5\s*\{[\s\S]*?text-wrap:\s*balance;/,
  );
});

test('hero keeps its display role without oversized Chinese text or an overly loose mobile summary', () => {
  assert.match(heroSource, /font-size:\s*var\(--font-size-hero-title\);/);
  assert.match(
    heroSource,
    /:global\(html\[data-locale='zh-CN'\]\) \.hero-greeting\s*\{[\s\S]*?font-weight:\s*700;[\s\S]*?letter-spacing:\s*-0\.01em;/,
  );
  assert.match(
    heroSource,
    /@media \(max-width:\s*640px\)[\s\S]*?\.hero-summary\s*\{[\s\S]*?font-size:\s*1\.0625rem;[\s\S]*?line-height:\s*1\.65;/,
  );
});

test('homepage and about sections share the same restrained section-title scale', () => {
  for (const source of homeSectionSources) {
    assert.match(source, /font-size:\s*var\(--font-size-section-title\);/);
  }

  assert.ok(
    aboutSource.match(/font-size:\s*var\(--font-size-section-title\);/g)?.length >= 3,
    'expected About page feature, section, and contact headings to share the section-title token',
  );
  assert.match(
    homepageSource,
    /\.home-section\s*\{[\s\S]*?padding:\s*var\(--space-home-section\) 0;/,
  );
});
