import { statSync } from 'node:fs';
import { join } from 'node:path';
import { getBriefs } from './briefs';
import {
  clockDuration,
  coverUrl,
  enclosureUrl,
  episodeDescription,
  feedUrl,
  homeUrl,
  isEpisode,
  rfc822FromBriefDate,
  transcriptUrl,
} from './podcast';

function xml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function cdata(value: string): string {
  return `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;
}

function enclosureBytes(audioPath: string): number {
  const relative = audioPath.replace(/^\/+/, '');
  const file = join(process.cwd(), 'public', relative);
  let size: number;
  try {
    size = statSync(file).size;
  } catch {
    throw new Error(`Missing podcast audio file: public/${relative}`);
  }
  if (!Number.isFinite(size) || size <= 0) {
    throw new Error(`Podcast audio is empty: public/${relative}`);
  }
  return size;
}

export async function renderPodcastFeed(): Promise<string> {
  const episodes = (await getBriefs()).filter(isEpisode);
  const self = feedUrl();
  const home = homeUrl();
  const cover = coverUrl();
  const updated = new Date().toUTCString();

  const items = episodes.map((brief) => {
    const audio = brief.data.audio;
    const expected = `audio/${brief.id}.mp3`;
    if (audio !== expected) {
      throw new Error(
        `Brief ${brief.id} must set audio: ${expected} so the episode, transcript, and file stay linked by date.`,
      );
    }
    const bytes = enclosureBytes(audio);
    const page = transcriptUrl(brief.id);
    const summary = brief.data.summary;
    const description = episodeDescription(brief);
    const notes = `<p>${xml(summary)}</p><p>Written brief (transcript): <a href="${xml(page)}">${xml(page)}</a></p>`;
    return `    <item>
      <title>${xml(brief.data.title)}</title>
      <description>${xml(description)}</description>
      <itunes:summary>${xml(summary)}</itunes:summary>
      <content:encoded>${cdata(notes)}</content:encoded>
      <link>${xml(page)}</link>
      <guid isPermaLink="true">${xml(page)}</guid>
      <pubDate>${xml(rfc822FromBriefDate(brief.data.date))}</pubDate>
      <itunes:duration>${xml(clockDuration(brief.data.durationSeconds))}</itunes:duration>
      <itunes:explicit>false</itunes:explicit>
      <itunes:image href="${xml(cover)}"/>
      <enclosure url="${xml(enclosureUrl(audio))}" length="${bytes}" type="audio/mpeg"/>
    </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Start Up Markets</title>
    <description>Weekly bleeding-edge VC markets: what’s hot and who to network with.</description>
    <language>en-us</language>
    <link>${xml(home)}</link>
    <atom:link href="${xml(self)}" rel="self" type="application/rss+xml"/>
    <itunes:author>Peter Smith</itunes:author>
    <itunes:owner>
      <itunes:name>Peter Smith</itunes:name>
    </itunes:owner>
    <copyright>Start Up</copyright>
    <itunes:explicit>false</itunes:explicit>
    <itunes:type>episodic</itunes:type>
    <itunes:category text="Business">
      <itunes:category text="Entrepreneurship"/>
    </itunes:category>
    <itunes:image href="${xml(cover)}"/>
    <image>
      <url>${xml(cover)}</url>
      <title>Start Up Markets</title>
      <link>${xml(home)}</link>
    </image>
    <lastBuildDate>${xml(updated)}</lastBuildDate>
${items.join('\n')}
  </channel>
</rss>
`;
}
