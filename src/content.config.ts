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
  schema: z
    .object({
      date: isoDate,
      title: z.string().min(1),
      summary: z.string().min(1),
      tags: z.array(z.string().min(1)).min(3).max(5),
      audio: z
        .string()
        .regex(/^audio\/\d{4}-\d{2}-\d{2}\.mp3$/, 'audio must be audio/YYYY-MM-DD.mp3')
        .optional(),
      durationSeconds: z.number().int().positive().max(24 * 60 * 60).optional(),
    })
    .superRefine((data, ctx) => {
      const hasAudio = data.audio != null;
      const hasDuration = data.durationSeconds != null;
      if (hasAudio === hasDuration) return;
      ctx.addIssue({
        code: 'custom',
        message: 'Set audio and durationSeconds together when a week has a podcast episode.',
        path: [hasAudio ? 'durationSeconds' : 'audio'],
      });
    }),
});

export const collections = { briefs };
