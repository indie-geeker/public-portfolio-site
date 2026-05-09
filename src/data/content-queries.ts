import { getCollection, type CollectionEntry } from 'astro:content';
import { isVisibleBlogPost } from './site-utils';

type ProjectEntry = CollectionEntry<'projects'>;

type FeaturedEntryLike = {
  data: {
    publishDate: Date;
    featured?: boolean;
    featuredOrder?: number;
    draft?: boolean;
  };
};

const sortByPublishDateDesc = <T extends FeaturedEntryLike>(a: T, b: T) =>
  b.data.publishDate.valueOf() - a.data.publishDate.valueOf();

const sortByFeaturedPriority = <T extends FeaturedEntryLike>(a: T, b: T) => {
  const aOrder = a.data.featuredOrder ?? Number.MAX_SAFE_INTEGER;
  const bOrder = b.data.featuredOrder ?? Number.MAX_SAFE_INTEGER;

  if (aOrder !== bOrder) {
    return aOrder - bOrder;
  }

  return sortByPublishDateDesc(a, b);
};

export const selectFeaturedEntries = <T extends FeaturedEntryLike>(
  entries: T[],
  limit = 3,
) => {
  const explicitFeatured = entries
    .filter((entry) => entry.data.featured === true)
    .sort(sortByFeaturedPriority);

  if (explicitFeatured.length >= limit) {
    return explicitFeatured.slice(0, limit);
  }

  const fallbackEntries = entries
    .filter((entry) => entry.data.featured !== true)
    .sort(sortByPublishDateDesc);

  return [...explicitFeatured, ...fallbackEntries].slice(0, limit);
};

const isVisibleProjectEntry = (entry: ProjectEntry) =>
  entry.data.draft !== true;

export const getVisibleBlogPosts = async (limit?: number) => {
  const posts = (await getCollection('blog'))
    .filter(isVisibleBlogPost)
    .sort(sortByPublishDateDesc);

  return typeof limit === 'number' ? posts.slice(0, limit) : posts;
};

export const getFeaturedBlogPosts = async (limit = 3) => {
  const posts = await getVisibleBlogPosts();
  return selectFeaturedEntries(posts, limit);
};

export const getVisibleProjects = async (limit?: number) => {
  const projects = (await getCollection('projects'))
    .filter(isVisibleProjectEntry)
    .sort(sortByPublishDateDesc);

  return typeof limit === 'number' ? projects.slice(0, limit) : projects;
};

export const getFeaturedProjects = async (limit = 3) => {
  const projects = await getVisibleProjects();
  return selectFeaturedEntries(projects, limit);
};
