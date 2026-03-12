# Content Architecture Unification Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move products onto Astro content collections, unify featured-content behavior for products and articles, and remove the current split between homepage data, project metadata, and content pages.

**Architecture:** Add a `projects` collection to [`src/content/config.ts`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/content/config.ts), centralize visibility and featured-selection rules in a shared query module, and then repoint homepage and `/project` rendering at those queries. Keep homepage copy in [`src/data/homepage.ts`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/data/homepage.ts), generate `/detail/<slug>` pages from project MDX entries, and remove deprecated TS/JSON product data only after collection-driven pages match current behavior.

**Tech Stack:** Astro 5, MDX content collections, TypeScript, SCSS, Node `node:test`, pnpm

---

### Task 1: Lock collection-driven behavior with regression coverage

**Files:**
- Modify: `tests/homepage.test.mjs`
- Create: `tests/projects.test.mjs`

**Step 1: Add homepage assertions for explicit featured selection**

Extend `tests/homepage.test.mjs` to assert that the built homepage contains the featured section copy but no longer depends on hardcoded product titles imported from [`src/data/homepage.ts`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/data/homepage.ts). Add checks for the future featured-query hooks, such as the homepage rendering exactly three featured product cards and three featured article cards from collection output.

**Step 2: Add `/project` route assertions**

Create `tests/projects.test.mjs` that builds the site and checks `dist/project/index.html` plus one generated `dist/detail/<slug>/index.html` page. Assert that product pages render collection-backed metadata such as title, tags, publish year, and optional external CTA text.

**Step 3: Run tests to verify they fail before implementation**

Run: `node --test tests/homepage.test.mjs tests/projects.test.mjs`

Expected: FAIL because the site still reads hardcoded arrays from [`src/data/project.ts`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/data/project.ts) and [`src/data/homepage.ts`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/data/homepage.ts), and no `projects` collection or generated detail route exists yet.

**Step 4: Commit the failing-test scaffold**

```bash
git add tests/homepage.test.mjs tests/projects.test.mjs
git commit -m "test: define collection-driven homepage and project coverage"
```

### Task 2: Extend the content schema and add shared query helpers

**Files:**
- Modify: `src/content/config.ts`
- Modify: `src/data/site-utils.ts`
- Create: `src/data/content-queries.ts`

**Step 1: Extend the blog schema with featured and draft fields**

Add optional fields to the `blog` collection schema:

```ts
featured: z.boolean().optional().default(false),
featuredOrder: z.number().int().optional(),
draft: z.boolean().optional().default(false),
```

Keep existing `title`, `description`, `publishDate`, `read`, `tags`, `img`, and `img_alt` validation intact.

**Step 2: Define the new `projects` collection schema**

Add a `projects` collection with fields shaped for both the list page and the homepage:

```ts
title: z.string(),
title_en: z.string().optional(),
description: z.string(),
publishDate: z.coerce.date(),
status: z.string().optional(),
tags: z.array(z.string()).default([]),
cover: z.string(),
externalUrl: z.string().url().optional(),
featured: z.boolean().optional().default(false),
featuredOrder: z.number().int().optional(),
draft: z.boolean().optional().default(false),
```

If a compatibility escape hatch is needed for migration, add `detailUrl: z.string().optional()` and remove it only after the dynamic route has replaced every manual detail page.

**Step 3: Centralize visibility, sorting, and featured fallback logic**

Create `src/data/content-queries.ts` with shared helpers such as:

```ts
getVisibleBlogPosts(limit?: number)
getFeaturedBlogPosts(limit = 3)
getVisibleProjects(limit?: number)
getFeaturedProjects(limit = 3)
```

Each helper should filter out `draft` entries, keep hidden blog template slugs excluded, sort explicit featured items by `featuredOrder` ascending then `publishDate` descending, and backfill with latest visible entries when fewer than `limit` featured items exist.

**Step 4: Keep low-level utility code small**

Leave generic helpers such as date formatting in [`src/data/site-utils.ts`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/data/site-utils.ts), but move collection-aware logic out of that file so page code imports from `content-queries.ts` instead of rebuilding sort/filter logic inline.

**Step 5: Run the targeted tests**

Run: `node --test tests/homepage.test.mjs tests/projects.test.mjs`

Expected: Still FAIL, but now because pages and components have not yet switched to the new queries even though the schema and helper layer exist.

**Step 6: Commit the schema and query layer**

```bash
git add src/content/config.ts src/data/site-utils.ts src/data/content-queries.ts
git commit -m "feat: add shared content collection queries"
```

### Task 3: Migrate current products into content entries

**Files:**
- Create: `src/content/projects/free-3d-valentines-assets/index.mdx`
- Create: `src/content/projects/todo/index.mdx`
- Create: `src/content/projects/tinklife/index.mdx`
- Create: `src/content/projects/gradientshub/index.mdx`
- Create: `src/content/projects/uiuxdeck/index.mdx`
- Create: `src/content/projects/rico-og-gallery/index.mdx`

**Step 1: Convert each current product record into MDX frontmatter**

For each record currently split across [`src/data/project.ts`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/data/project.ts) and [`src/data/homepage.ts`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/data/homepage.ts), create a matching MDX entry:

```mdx
---
title: "GradientsHub"
description: "一个面向设计师和开发者的高级渐变背景资源库，支持快速筛选与下载。"
publishDate: 2025-02-28
status: "已上线"
tags: ["产品", "设计资源"]
cover: "/assets/cover/cover-gradientshub.jpg"
externalUrl: "https://gradientshub.com/?ref=portfolio"
featured: true
featuredOrder: 10
draft: false
---
```

Use the MDX body for the project narrative, release notes, screenshots, or migration notes that are currently trapped inside manual Astro detail pages.

**Step 2: Preserve existing detail behavior during migration**

If a migrated project still relies on a manual detail page, temporarily set `detailUrl` in frontmatter to the current route such as `/detail/todo` or `/detail/tinklife`. Keep that compatibility field only until the shared dynamic route is ready.

**Step 3: Validate schema correctness**

Run: `pnpm astro check`

Expected: PASS with no schema validation errors from the new `projects` entries.

**Step 4: Commit the content migration**

```bash
git add src/content/projects
git commit -m "feat: migrate products into content entries"
```

### Task 4: Rebuild homepage and `/project` from collection queries

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/home/FeaturedProducts.astro`
- Modify: `src/components/home/LatestNotes.astro`
- Modify: `src/pages/project.astro`
- Modify: `src/components/ProjectList.astro`
- Modify: `src/data/homepage.ts`

**Step 1: Replace homepage inline collection logic with shared query helpers**

Update [`src/pages/index.astro`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/pages/index.astro) to load:

```ts
const featuredProjects = await getFeaturedProjects(3);
const featuredPosts = await getFeaturedBlogPosts(3);
```

Remove the current inline `getCollection('blog').filter(...).sort(...).slice(0, 3)` logic.

**Step 2: Make `FeaturedProducts.astro` data-driven**

Change [`src/components/home/FeaturedProducts.astro`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/components/home/FeaturedProducts.astro) so it accepts a `projects` prop instead of importing `featuredProducts` from [`src/data/homepage.ts`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/data/homepage.ts). Keep the section intro copy in `homepage.ts`, but derive card title, description, cover, status, tags, and link target from project entries.

**Step 3: Make homepage article selection truly featured**

Keep [`src/components/home/LatestNotes.astro`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/components/home/LatestNotes.astro) as a presentational component, but feed it the output of `getFeaturedBlogPosts(3)` so "精选文章" reflects explicit editorial choices with a latest-content fallback.

**Step 4: Rebuild the product list page from `projects` entries**

Update [`src/pages/project.astro`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/pages/project.astro) and [`src/components/ProjectList.astro`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/components/ProjectList.astro) to render collection entries instead of `projectItems`. Preserve current visual treatment, but derive tags, year, and detail link from the collection entry.

**Step 5: Remove card data from homepage copy config**

Shrink [`src/data/homepage.ts`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/data/homepage.ts) so it only exports intro text such as `featuredProductsIntro` and `latestNotesIntro`, not the actual featured card arrays.

**Step 6: Re-run regression tests**

Run: `node --test tests/homepage.test.mjs tests/projects.test.mjs`

Expected: PASS with homepage and `/project` now driven by collection queries and explicit featured rules.

**Step 7: Commit the page-data source swap**

```bash
git add src/pages/index.astro src/components/home/FeaturedProducts.astro src/components/home/LatestNotes.astro src/pages/project.astro src/components/ProjectList.astro src/data/homepage.ts tests/homepage.test.mjs tests/projects.test.mjs
git commit -m "refactor: drive homepage and project index from collections"
```

### Task 5: Add a shared dynamic project detail route

**Files:**
- Create: `src/pages/detail/[slug].astro`
- Modify: `src/components/ProjectList.astro`
- Modify: `src/components/home/FeaturedProducts.astro`
- Modify: `src/layouts/DetailPostLayout.astro`

**Step 1: Generate project detail pages from the `projects` collection**

Create `src/pages/detail/[slug].astro` with `getStaticPaths()` based on `getCollection('projects')`. Render the MDX body through `entry.render()` and pass title, description, and keywords into [`src/layouts/DetailPostLayout.astro`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/layouts/DetailPostLayout.astro).

**Step 2: Standardize project detail metadata**

Inside the dynamic route, render:
- the project title and optional English subtitle
- publish date and status
- tags
- cover image
- MDX body content
- a CTA button to `externalUrl` when present

This becomes the default layout for every migrated project entry.

**Step 3: Update internal product links**

Make the `/project` list link to `/detail/${entry.slug}` unless a temporary compatibility `detailUrl` is still set during migration. Keep homepage featured-product cards linking to `externalUrl` when the goal is direct product launch; otherwise fall back to the internal detail route.

**Step 4: Verify generated detail pages**

Run: `pnpm build`

Expected: PASS and generated files under `dist/detail/<slug>/index.html` for each migrated project.

**Step 5: Commit the shared detail route**

```bash
git add src/pages/detail/[slug].astro src/components/ProjectList.astro src/components/home/FeaturedProducts.astro src/layouts/DetailPostLayout.astro
git commit -m "feat: add collection-driven project detail pages"
```

### Task 6: Remove deprecated product data sources and finish cleanup

**Files:**
- Delete: `src/data/project.ts`
- Delete: `src/data/home.json`
- Delete: `src/components/Cards.astro`
- Modify: `src/data/homepage.ts`
- Modify: `tests/homepage.test.mjs`
- Modify: `tests/projects.test.mjs`

**Step 1: Confirm no live code still imports deprecated data**

Run: `rg -n "projectItems|home\\.json|featuredProducts\\b" src tests`

Expected: No remaining runtime references to [`src/data/project.ts`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/data/project.ts), [`src/data/home.json`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/data/home.json), or the removed featured-product array export.

**Step 2: Delete the dead files**

Remove the obsolete data modules and any now-unused legacy card component once the ripgrep check is clean.

**Step 3: Run the full verification suite**

Run: `node --test tests/homepage.test.mjs tests/projects.test.mjs`

Expected: PASS

Run: `pnpm build`

Expected: PASS with Astro check and production build succeeding.

**Step 4: Commit the cleanup**

```bash
git add -A
git commit -m "refactor: remove deprecated product data sources"
```
