# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a designer portfolio website built with Astro.js 5.16.0, featuring a bilingual (Chinese/English) interface for showcasing projects, blog posts, and personal information. The site includes 3D visual effects and supports MDX for rich blog content.

## Development Commands

### Package Management
This project uses **pnpm** (visible from pnpm-lock.yaml in git status).

```bash
pnpm install          # Install dependencies
pnpm dev             # Start dev server at localhost:4321
pnpm build           # Type-check and build (runs astro check first)
pnpm preview         # Preview production build locally
pnpm astro           # Run Astro CLI commands
```

## Architecture

### Core Structure

**Content Management:**
- `src/data/content.ts` - Site-wide configuration (navigation, SEO, social links, page descriptions)
- `src/data/project.ts` - Project list with metadata (follows ProjectItem interface)
- `src/data/home.json` - Homepage featured work showcase with filtering
- `src/content/blog/*` - Markdown/MDX blog posts (auto-indexed)
- `src/content/config.ts` - Astro content collection schema for blog validation

**Layouts:**
- `BaseLayout.astro` - Root layout with head, nav, footer
- `BlogPostLayout.astro` - Blog post wrapper
- `DetailPostLayout.astro` - Project detail pages wrapper

**Pages:**
- `src/pages/index.astro` - Homepage with filterable project grid
- `src/pages/project.astro` - Full project list
- `src/pages/blog.astro` - Blog listing
- `src/pages/blog/[...slug].astro` - Dynamic blog post routes
- `src/pages/detail/*.astro` - Manual project detail pages (not auto-generated)
- `src/pages/about.astro` - About page (manually maintained)

**Effects:**
- `src/effects/Effect.astro` - 3D visual effects (need3d icons from need3d.ru by @ilyarygin)
- `src/effects/EffectSwitch.astro` - Toggle for 3D effects

### Path Aliases

Configured in `tsconfig.json`:
- `@/components/*` → `src/components/*.astro`
- `@/layouts/*` → `src/layouts/*.astro`
- `@/data/*` → `src/data/*`
- `@/styles` → `src/styles/`
- `@/assets/*` → `src/assets/*`

### Analytics

Optional analytics via environment variables:
- Google Analytics 4: `PUBLIC_GA4_ID`
- Umami: `PUBLIC_UMAMI_ID`

Component: `src/components/functions/Analytics.astro`

### MDX Support

MDX is integrated via `@astrojs/mdx`. Blog posts can be `.md` or `.mdx` files in `src/content/blog/`.

### Styling

Sass preprocessor with modern API enabled in `astro.config.mjs`. Code highlighting uses `github-dark` theme.

## Content Editing Guidelines

### Adding Homepage Projects

Edit `src/data/home.json`:
```typescript
{
  "id": "unique-id",
  "title": "Project Name",
  "cover": "/assets/cover/image.jpg",
  "desc": "Short description",
  "url": "https://live-url.com",
  "detail": "/detail/project-page",  // Must manually create this page
  "category": "web|ui|3d|photography|brand",
  "tag": "Display Tag",
  "date": "YYYY-MM-DD",
  "mark": true  // Shows recommendation badge
}
```

Categories map to filter buttons defined in `src/data/content.ts` → `filterItems`.

### Adding Projects to Project List

Edit `src/data/project.ts` following the `ProjectItem` interface:
```typescript
{
  title: "中文标题",
  title_en: "English Title",
  date: "YYYY-MM-DD",
  detail: "/detail/url-slug",  // Must create corresponding .astro file
  url: "https://live-url.com",
  cover: ['path/img1.jpg', 'path/img2.jpg'],
  tags: ['WEB', 'UI', '3D']
}
```

**Critical:** Project detail pages are NOT auto-generated. Must manually create `.astro` files in `src/pages/detail/` and set the `detail` field to match the route.

### Adding Blog Posts

1. Create `.md` or `.mdx` file in `src/content/blog/`
2. Include required frontmatter:
```yaml
---
title: "Post Title"
description: "Optional description"
publishDate: 2024-01-01
read: 5  # Optional reading time in minutes
tags: ["tag1", "tag2"]  # Optional
img: "/path/to/cover.jpg"  # Optional
img_alt: "Image description"  # Optional
---
```

Blog list auto-updates based on files in the content collection.

### Updating Site Configuration

Edit `src/data/content.ts`:
- `siteConfig` - Site name and URL (from env vars)
- `nav` - Navigation menu items and avatar
- `footerText` - Copyright text
- `*Tdk` - SEO metadata for each page
- `socialLinks` - Social media links with SVG icons
- `pageTag` - Page header labels
- `pageDescription` - Page subtitle descriptions
- `filterItems` - Homepage project filters

### Environment Variables

Required in `.env` (copy from `.env.example`):
```
PUBLIC_SITE_URL=https://yoursite.com/
PUBLIC_SITE_NAME=Your Site Name
PUBLIC_GA4_ID=  # Optional
PUBLIC_UMAMI_ID=  # Optional
```

These are accessed via `import.meta.env.PUBLIC_*` in Astro components.

## Typography

- Chinese headlines: 汇文明朝体 (converted to SVG for embedding)
- Chinese body: Noto Sans SC (Source Han Sans)
- English: Special Elite (Google Font)

## Git Workflow

Main branch: `main`

Recent changes include:
- Added MDX support
- Added 3D effect toggle
- Integrated Google Analytics and Umami
- Updated to Astro.js 5.12.8 (now 5.16.0)
