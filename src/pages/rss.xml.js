import rss from "@astrojs/rss";
import { getVisibleBlogPosts } from "../data/content-queries";

export async function GET(context) {
  const blog = await getVisibleBlogPosts();
  return rss({
    title: 'Ricocc Blog Template Astro',
    description: 'Astro Blog Template by Ricocc',
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
      stylesheet: '/rss/pretty-feed-v3.xsl',
    })),
  });
}
