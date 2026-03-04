# 100hellos-docs

Containerized Gatsby static site that aggregates content from the `100hellos/` and `fraglet/` projects.

## Architecture

- **Gatsby** static site generator running inside a Docker container
- Content is **not checked in** — it's read from mounted `100hellos/` and `fraglet/` volumes at build time
- A Node.js **preprocessor** (`scripts/preprocess.js`) gathers markdown, injects front-matter, and writes to `src/content/languages/` before Gatsby builds
- Language metadata (year, paradigm, category, influencedBy) lives in each language's `metadata.yml` inside the `100hellos/` repo
- The `influences` field is computed at build time as the inverse of all `influencedBy` relationships

## Build

```bash
./build.sh
```

This checks out `hackathon-branch-handoff` on both upstream repos, builds the Docker image, and runs it with volume mounts. Output goes to `public/`.

## Key Files

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
1. Add a `metadata.yml` to the language directory with displayName, year, paradigm, influencedBy, category
2. Rebuild — the preprocessor auto-discovers new directories and computes influences

## Conventions

- All content comes exclusively from mounted volumes — nothing is fetched at build time
- Front-matter is the interface between the preprocessor and Gatsby templates
- CSS uses custom properties for theming — no hardcoded colors in components
