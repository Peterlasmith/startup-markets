# Start Up Markets

Public archive of Peter’s weekly **Bleeding-Edge Markets** briefs: what’s hot among top VCs, and who to network with.

Live site: <https://peterlasmith.github.io/startup-markets/>

Seed brief (transcript): <https://peterlasmith.github.io/startup-markets/briefs/2026-09-21/>

Podcast: <https://peterlasmith.github.io/startup-markets/podcast/>

Podcast RSS: <https://peterlasmith.github.io/startup-markets/podcast.xml>

Each brief is one Markdown file. The site is a static Astro build. Weeks with an MP3 are also podcast episodes. The written brief stays the transcript. The feed is the audio companion.

## Podcast feed

`podcast.xml` is generated at build time from briefs that set `audio` and `durationSeconds`. It is a podcast RSS 2.0 feed (`itunes` and `content` namespaces).

- Channel: **Start Up Markets** — weekly bleeding-edge VC markets: what’s hot and who to network with. Language `en-us`. Author Peter Smith. Owner Peter Smith. Copyright Start Up. Explicit `false`. Category Business › Entrepreneurship.
- Cover: `public/podcast-cover.png` (1400×1400), served at <https://peterlasmith.github.io/startup-markets/podcast-cover.png>.
- Each item links to that week’s brief, with `itunes:duration` and an `enclosure` whose `length` is the MP3’s size in bytes (read from `public/audio/` during the build).

Any podcast app can subscribe by pasting the feed URL. The archive and the podcast page both show it in a copyable field.

## Add next week’s brief

1. Create `content/briefs/YYYY-MM-DD.md`. Use the publish date (the Monday the brief is written, America/Denver).
2. Start the file with this frontmatter. `tags` is 3–5 hot-area labels — they drive the archive filter.

```yaml
---
date: "YYYY-MM-DD"
title: "Bleeding-Edge Markets — Week of YYYY-MM-DD"
summary: "One sentence on what’s hot and who matters this week."
tags:
  - Agent security
  - Software factories
  - Heterogeneous inference
---
```

3. Write the memo under the frontmatter. Keep the usual sections:

- Hot areas
- Thesis watch
- Who to network with
- Capital signals
- Cooling / crowded
- Sources

4. Commit the file and push to `main`.

That’s the whole update for a written brief with no audio. Do not add placeholder weeks — only briefs that were actually written.

## Add next week’s episode

The episode, the transcript, and the MP3 share one date: the brief’s `YYYY-MM-DD`. The seed episode is `2026-09-21` (Monday publish date, 395 seconds, file `public/audio/2026-09-21.mp3`). The next brief on that Monday cadence is **2026-09-28**. Record on Sunday if you like — the show signs off toward Sunday — and push that night. Name the files with the brief date so the feed, the player, and the transcript stay one item.

1. Create `content/briefs/2026-09-28.md` using the frontmatter in the previous section. Add the podcast fields:

```yaml
audio: audio/2026-09-28.mp3
durationSeconds: 395
```

Replace `395` with this recording’s length in whole seconds. The seed episode is 395 (6:35). `audio` must be `audio/` plus the brief filename. Show notes are the brief’s `summary`. The memo is the transcript.

2. Save the recording at `public/audio/2026-09-28.mp3`. You do not enter the byte length. The build runs `stat` on that file and writes it to the enclosure `length`.

3. Commit the Markdown file and the MP3, then push to `main`.

GitHub Actions (`.github/workflows/pages.yml`) builds the site and publishes `dist/` to the `gh-pages` branch. After that deploy:

- Transcript: `https://peterlasmith.github.io/startup-markets/briefs/2026-09-28/`
- Player on that page, and on `https://peterlasmith.github.io/startup-markets/podcast/`
- Enclosure: `https://peterlasmith.github.io/startup-markets/audio/2026-09-28.mp3`
- Feed item in `https://peterlasmith.github.io/startup-markets/podcast.xml`

The first deploy after a push usually finishes in a couple of minutes. A week with no MP3 is still a brief; leave `audio` and `durationSeconds` off and it stays out of the feed.

## Redeploy

A push to `main` runs `.github/workflows/pages.yml`. The workflow builds the site and publishes it to the `gh-pages` branch, which GitHub Pages serves. The new brief is first on the archive, with a permalink:

`https://peterlasmith.github.io/startup-markets/briefs/YYYY-MM-DD/`

The first deploy after a push usually finishes in a couple of minutes. No manual publish step.

## Local preview

```bash
npm install
npm run dev
```

Open the URL Astro prints (http://localhost:4321/). Production uses the `/startup-markets/` base path; local preview does not.

```bash
npm run build
npm run preview
```
