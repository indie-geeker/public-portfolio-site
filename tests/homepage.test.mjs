import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildSite } from './helpers/build-site.mjs';

const cwd = process.cwd();
const distDir = join(cwd, 'dist');
const homepagePath = join(distDir, 'index.html');
const aboutPagePath = join(distDir, 'about', 'index.html');
buildSite();

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
