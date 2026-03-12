import type { CollectionEntry } from 'astro:content';

type BlogEntry = CollectionEntry<'blog'>;

export const hiddenBlogSlugs = new Set([
  'article-template',
  'chinese-article-template',
]);

export const isVisibleBlogPost = (post: Pick<BlogEntry, 'slug' | 'data'>) =>
  !hiddenBlogSlugs.has(post.slug) && post.data.draft !== true;

export const sortBlogPostsByDateDesc = (
  a: Pick<BlogEntry, 'data'>,
  b: Pick<BlogEntry, 'data'>,
) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf();

export const formatIsoDate = (date: Date) => date.toISOString().split('T')[0];

export const isExternalHref = (href: string) => /^https?:\/\//.test(href);
