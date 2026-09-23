import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const isoDate = z.preprocess((value) => {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value;
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'));

const briefs = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: './content/briefs',
    generateId: ({ entry }) => entry.replace(/\.md$/, '').split(/[/\\]/).pop() ?? entry,
  }),
  schema: z.object({
    date: isoDate,
    title: z.string().min(1),
    summary: z.string().min(1),
    tags: z.array(z.string().min(1)).min(3).max(5),
  }),
});

export const collections = { briefs };
