import { defineCollection, z } from 'astro:content';
const blogCollection =  defineCollection({
		type: 'content',
		schema: z.object({
			title: z.string(),
			description: z.string().optional(),
			publishDate: z.coerce.date(),
			read: z.number().optional(),
			tags: z.array(z.string()).optional(),
			img: z.string().optional(),
			img_alt: z.string().optional(),
			featured: z.boolean().optional().default(false),
			featuredOrder: z.number().int().optional(),
			draft: z.boolean().optional().default(false),
		}),
});

const projectsCollection = defineCollection({
		type: 'content',
		schema: ({ image }) => z.object({
			title: z.string(),
			title_en: z.string().optional(),
			description: z.string(),
			publishDate: z.coerce.date(),
			status: z.string().optional(),
			tags: z.array(z.string()).optional().default([]),
			cover: image(),
			gallery: z.array(image()).optional().default([]),
			externalUrl: z.string().url().optional(),
			featured: z.boolean().optional().default(false),
			featuredOrder: z.number().int().optional(),
			draft: z.boolean().optional().default(false),
		}),
});

export const collections = {
	'blog': blogCollection,
	'projects': projectsCollection,
};
