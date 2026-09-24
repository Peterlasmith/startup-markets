import type { Brief } from './briefs';

/** Live GitHub Pages origin for this project site. */
export const CANONICAL_ORIGIN = 'https://peterlasmith.github.io/startup-markets';

/**
 * Absolute origin + base path for public podcast URLs.
 * Production builds set SITE and BASE_URL. Local preview uses `/`, so fall back
 * to the Pages URL subscribers actually paste into a podcast app.
 */
export function publicBase(): string {
  const site = String(import.meta.env.SITE ?? 'https://peterlasmith.github.io').replace(/\/$/, '');
  const base = String(import.meta.env.BASE_URL ?? '/');
  if (base === '/' || base === '') return CANONICAL_ORIGIN;
  return `${site}${base.replace(/\/$/, '')}`;
}

export function publicUrl(path = ''): string {
  const clean = path.replace(/^\/+/, '');
  const base = publicBase();
  return clean ? `${base}/${clean}` : `${base}/`;
}

export function feedUrl(): string {
  return publicUrl('podcast.xml');
}

export function coverUrl(): string {
  return publicUrl('podcast-cover.png');
}

export function homeUrl(): string {
  return publicUrl();
}

export function transcriptUrl(id: string): string {
  return publicUrl(`briefs/${id}/`);
}

export function enclosureUrl(audioPath: string): string {
  return publicUrl(audioPath.replace(/^\/+/, ''));
}

/** Same-origin path for the player, so local preview and Pages both load the file. */
export function audioHref(audioPath: string): string {
  return `${import.meta.env.BASE_URL}${audioPath.replace(/^\/+/, '')}`;
}

export function podcastPagePath(): string {
  return `${import.meta.env.BASE_URL}podcast/`;
}

export function clockDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

export function isEpisode(
  brief: Brief,
): brief is Brief & { data: Brief['data'] & { audio: string; durationSeconds: number } } {
  return typeof brief.data.audio === 'string' && typeof brief.data.durationSeconds === 'number';
}

/** Show notes stay inside the brief summary. The memo is the transcript. */
export function episodeDescription(brief: Brief): string {
  return `${brief.data.summary} Written brief (transcript): ${transcriptUrl(brief.id)}`;
}

/** Brief date at 15:00 UTC (morning in America/Denver). */
export function rfc822FromBriefDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 15, 0, 0)).toUTCString();
}
