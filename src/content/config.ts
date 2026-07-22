import { defineCollection, z } from 'astro:content';
const blogCollection =  defineCollection({
		type: 'content',
		schema: z.object({
			title: z.string(),
			title_en: z.string().optional(),
			description: z.string().optional(),
			description_en: z.string().optional(),
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
			description_en: z.string().optional(),
			publishDate: z.coerce.date(),
			status: z.string().optional(),
			status_en: z.string().optional(),
			tags: z.array(z.string()).optional().default([]),
			tags_en: z.array(z.string()).optional().default([]),
			concept: z.boolean().optional().default(true),
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
