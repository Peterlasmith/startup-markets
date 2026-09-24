import type { APIRoute } from 'astro';
import { renderPodcastFeed } from '../lib/podcast-feed';

export const GET: APIRoute = async () => {
  const body = await renderPodcastFeed();
  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
