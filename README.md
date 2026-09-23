# Start Up Markets

Public archive of Peter’s weekly **Bleeding-Edge Markets** briefs: what’s hot among top VCs, and who to network with.

Live site: <https://peterlasmith.github.io/startup-markets/>

Each brief is one Markdown file. The site is a static Astro build published to GitHub Pages.

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

That’s the whole update. Do not add placeholder weeks — only briefs that were actually written.

## Redeploy

A push to `main` runs `.github/workflows/pages.yml`. GitHub Actions builds the site and deploys GitHub Pages. The new brief is first on the archive, with a permalink:

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
