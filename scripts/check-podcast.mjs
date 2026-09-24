import { existsSync, readFileSync, statSync } from 'node:fs';

const xmlPath = 'dist/podcast.xml';
const audioPath = 'public/audio/2026-09-21.mp3';

if (!existsSync(xmlPath)) {
  console.error(`${xmlPath} is missing from the static build.`);
  process.exit(1);
}

const xml = readFileSync(xmlPath, 'utf8');
const bytes = statSync(audioPath).size;

const needles = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<rss version="2.0"',
  'xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"',
  '<title>Start Up Markets</title>',
  'Weekly bleeding-edge VC markets:',
  '<language>en-us</language>',
  '<link>https://peterlasmith.github.io/startup-markets/</link>',
  '<itunes:author>Peter Smith</itunes:author>',
  '<itunes:name>Peter Smith</itunes:name>',
  '<copyright>Start Up</copyright>',
  '<itunes:explicit>false</itunes:explicit>',
  '<itunes:category text="Business">',
  '<itunes:category text="Entrepreneurship"/>',
  'https://peterlasmith.github.io/startup-markets/podcast-cover.png',
  'https://peterlasmith.github.io/startup-markets/podcast.xml',
  'https://peterlasmith.github.io/startup-markets/briefs/2026-09-21/',
  'https://peterlasmith.github.io/startup-markets/audio/2026-09-21.mp3',
  `length="${bytes}"`,
  'type="audio/mpeg"',
  '<itunes:duration>6:35</itunes:duration>',
  'Agent Security, Software Factories &amp; the Watts Bottleneck',
];

let failed = false;
for (const needle of needles) {
  if (!xml.includes(needle)) {
    console.error(`podcast.xml missing: ${needle}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`podcast.xml ok (${bytes} byte enclosure)`);
