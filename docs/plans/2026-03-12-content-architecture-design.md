# Content Architecture Unification Design

**Goal:** Unify products and articles under Astro content collections so content entry follows one mental model, homepage featured content becomes configurable instead of hardcoded, and the site no longer maintains separate product data across multiple files.

**Scope:** Introduce a `projects` collection alongside the existing `blog` collection, move product metadata into content files, replace homepage featured-product data with collection-driven queries, and upgrade homepage featured-article behavior from "latest three posts" to explicit featured selection with a safe fallback.

**Approach:** Make content collections the only source of truth for publishable content. Keep homepage copy and section labels in [`src/data/homepage.ts`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/data/homepage.ts), but move card data, sorting, visibility, and featured selection into collection queries. Default product detail pages will render through a shared dynamic template, while the design preserves an escape hatch for unusually custom project presentations.

**Content Model:**
- Keep `blog` in [`src/content/blog`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/content/blog) and extend its schema with optional `featured`, `featuredOrder`, and `draft` fields.
- Add `projects` in `src/content/projects/<slug>/index.mdx` so each product owns its metadata and body in one place.
- Define project fields for title, summary, publish date, tags, status, cover, external URL, featured state, featured order, and draft visibility.
- Treat collection entries as the only publishable records; deprecate [`src/data/project.ts`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/data/project.ts), the featured-product array in [`src/data/homepage.ts`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/data/homepage.ts), and the legacy [`src/data/home.json`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/data/home.json).

**Page Model:**
- Continue rendering the blog list and blog detail pages from the `blog` collection.
- Rebuild `/project` from the `projects` collection instead of `projectItems`.
- Replace manual product detail pages in [`src/pages/detail`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/pages/detail) with a shared dynamic route, keeping `/detail/<slug>` as the public URL pattern for continuity.
- Keep an escape hatch for project entries that need richer presentation than a shared MDX template can comfortably express.

**Featured Content Rules:**
- Add a shared featured contract to both collections: `featured: boolean`, `featuredOrder?: number`, and `draft?: boolean`.
- Homepage featured queries first select explicit featured entries, sort by `featuredOrder` ascending and `publishDate` descending, and then cap at three items.
- If fewer than three explicit featured entries exist, fill the remainder with the latest non-draft published content.
- Keep section titles and descriptions in [`src/data/homepage.ts`](/Users/wen/Desktop/Personal/Projects/public-portfolio-site/src/data/homepage.ts), but compute the featured cards from collection helpers.

**Migration Strategy:**
- Phase 1 introduces the new collection schema and shared query helpers without changing visible page structure.
- Phase 2 repoints the homepage featured sections and `/project` list page at the new collection-driven queries.
- Phase 3 replaces manual detail pages with the shared dynamic project route and removes deprecated product data files once parity is confirmed.

**Risk Controls:**
- Preserve current public detail URLs to avoid unnecessary routing churn.
- Support existing project asset paths during migration, then move toward per-entry colocated assets for new content.
- Keep a compatibility path for highly custom project layouts instead of forcing every project into the same visual mold on day one.
- Make featured queries deterministic so homepage content does not unexpectedly change when new posts are published.

**Validation:**
- Add regression coverage for collection-driven homepage sections and the rebuilt `/project` page.
- Verify the site still builds cleanly with `pnpm build` after the new schema and routes are introduced.
- Confirm legacy template blog posts remain hidden from public listings and that draft entries are excluded from homepage and index queries.
