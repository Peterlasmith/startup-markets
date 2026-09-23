import { getCollection, type CollectionEntry } from 'astro:content';

export type Brief = CollectionEntry<'briefs'>;

export async function getBriefs(): Promise<Brief[]> {
  const briefs = await getCollection('briefs');
  return briefs.sort((a, b) => b.data.date.localeCompare(a.data.date) || b.id.localeCompare(a.id));
}

export function tagCounts(briefs: Brief[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const brief of briefs) {
    for (const tag of brief.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function searchText(brief: Brief): string {
  return [brief.data.title, brief.data.summary, ...brief.data.tags].join(' ').toLowerCase();
}

export function formatDate(iso: string, month: 'long' | 'short' = 'long'): string {
  const [year, mon, day] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    month,
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, mon - 1, day)));
}

export function briefPath(id: string): string {
  return `${import.meta.env.BASE_URL}briefs/${id}/`;
}
