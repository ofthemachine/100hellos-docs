# 100hellos-docs

Containerized Gatsby static site that aggregates content from the `100hellos/` and `fraglet/` projects.

## Architecture

- **Gatsby** static site generator running inside a Docker container
- Content is **not checked in** — it's read from mounted `100hellos/` and `fraglet/` volumes at build time
- A Node.js **preprocessor** (`scripts/preprocess.js`) gathers markdown, injects front-matter, and writes to `src/content/languages/` before Gatsby builds
- The `languages-metadata.yml` file provides curated data (year, paradigm, relationships) for the timeline graph

## Build

```bash
./build.sh
```

This checks out `hackathon-branch-handoff` on both upstream repos, builds the Docker image, and runs it with volume mounts. Output goes to `public/`.

## Key Files

- `languages-metadata.yml` — Source of truth for language metadata (year, paradigm, influencedBy, category)
- `scripts/preprocess.js` — Reads from `/mnt/100hellos` and `/mnt/fraglet`, generates markdown with front-matter
- `scripts/entrypoint.sh` — Container entrypoint: validates mounts → preprocess → gatsby build → copy output
- `gatsby-node.js` — Creates `/languages/{slug}` pages from generated markdown
- `src/components/TimelineGraph.js` — D3.js timeline visualization of language history

## Data Sources

- **Language list**: All 100hellos directories not in `.no-publish`
- **Fraglet status**: Cross-referenced against `fraglet/pkg/embed/veins.yml` → `fragletEnabled` front-matter field
- **Build schedule**: Parsed from `100hellos/.build-batch-{mon..sun}`
- **Content per language**: README.md, fraglet/guide.md, files/*, veins_test examples

## Theme

Light/dark toggle via CSS custom properties. Theme preference stored in localStorage.

## Adding a New Language

When a new language is added to 100hellos:
1. Add an entry to `languages-metadata.yml` with year, paradigm, influencedBy, influences, category
2. Rebuild — the preprocessor auto-discovers new directories

## Conventions

- All content comes exclusively from mounted volumes — nothing is fetched at build time
- Front-matter is the interface between the preprocessor and Gatsby templates
- CSS uses custom properties for theming — no hardcoded colors in components
