# BLD Southeast 2026

Conference site for BLD Southeast (Sept 16–17, 2026, Washington DC), built on
Astro 5 + TinaCMS, deployed as a static site on Cloudflare.

## Getting started

```shell
npm install
npm run dev        # local dev server at localhost:4321
npm run build      # production build to ./dist
npm run preview    # preview the production build locally
```

## Content editing

All editable copy lives in a single structured file, [`content/landing.json`](content/landing.json),
edited visually via **TinaCMS** at `/admin` (schema defined in [`tina/config.ts`](tina/config.ts)).
`npm run build` reads this file directly at build time — the site builds and
runs fine with or without TinaCloud reachable.

Images used by TinaCMS's media picker must live under `public/images/`, not
`src/assets/` — that's a hard constraint of how Tina's picker is wired up
here.

> **Known issue:** TinaCloud branch-indexing for this project's `main` branch
> is currently stuck (`GET /db/{clientId}/status/main` on both
> `content.tinajs.io` and `content-v2.tinajs.io` returns
> `{"status":"unknown","hasUpstream":false}` indefinitely, despite the GitHub
> App having correct repo access and the webhook reporting successful
> delivery). This blocks `tinacms build`, so the site currently deploys via
> plain `npm run build` (Tina-free) — see "Deployment" below. `/admin` is
> not yet functional in production until this is resolved with Tina support.

## Deployment

The production site is deployed on **Cloudflare** and lives in the
**Marit Digital** Cloudflare account — the same account that owns the
`bldsoutheast.com` DNS zone. This matters: a Cloudflare Worker or Pages
project can only bind a Custom Domain to a zone that lives in the **same**
account. Deploying this site from a *different* Cloudflare account and
pointing DNS at it via a proxied CNAME will fail with
**Error 1014 (CNAME Cross-User Banned)** — Cloudflare blocks proxied
cross-account CNAMEs to `*.workers.dev` / `*.pages.dev` targets specifically.
Don't try it; this was already hit once and caused a live outage.

### One-time setup (Cloudflare Pages, Git-connected)

1. In the Marit Digital Cloudflare account: **Workers & Pages → Create →
   Pages tab → Connect to Git.**
2. Authorize the Cloudflare Pages GitHub App for
   `Mangrove-Web-Development/bld-southeast` (repo is private; needs one-time
   GitHub authorization).
3. Build settings:
   - Build command: `npm run build` — **not** `npm run build:cloudflare`.
     The latter runs `tinacms build` first, which currently fails the whole
     build because of the TinaCloud issue noted above (this has already
     broken one deploy attempt). Switch to `build:cloudflare` only after
     TinaCloud branch-indexing is confirmed working.
   - Build output directory: `dist`
4. Deploy, verify on the generated `*.pages.dev` URL first.
5. On that Pages project, go to **Custom domains → Set up a custom domain**
   and add `bldsoutheast.com` (and `www.bldsoutheast.com` if desired).
   Because the Pages project and the DNS zone are in the same account,
   Cloudflare manages the DNS record automatically — no manual record edits
   needed.

Once this is set up, every push to `main` deploys automatically. No manual
uploads or DNS edits should be needed for routine updates.

### Manual/emergency deploy (fallback only)

If Git-connected deploy isn't set up yet or is broken, a build can be pushed
manually via Wrangler from any Cloudflare account that already has a Worker
provisioned for this project:

```shell
npm run build
npx wrangler deploy
```

This only updates the `*.workers.dev` URL for that Worker — it does **not**
touch `bldsoutheast.com` DNS, and should not be used as a way to bind the
custom domain (see the Error 1014 warning above).

## Project structure

```
/
├── content/landing.json      # all editable page content (Tina-managed)
├── tina/config.ts            # Tina CMS schema
├── public/
│   ├── _headers              # CSP + cache headers (Cloudflare)
│   ├── images/                # Tina-managed media (logos, photos)
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── sections/          # page sections (Hero, Sponsors, Agenda, ...)
│   │   ├── primitives/        # shared building blocks (LogoGrid, ...)
│   │   ├── Header.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   ├── Layout.astro       # <head>, fonts, global scripts
│   │   └── BaseLayout.astro   # Header + <main> + Footer shell
│   ├── pages/
│   │   ├── index.astro        # the entire site — single landing page
│   │   └── 404.astro
│   └── styles/tokens.css      # design tokens (color, spacing, type)
├── scripts/optimize-images.mjs
├── astro.config.ts
└── wrangler.jsonc
```

## Design system

Design tokens (color, spacing, type scale, radii, motion) live in
[`src/styles/tokens.css`](src/styles/tokens.css) — default to `var(--token)`
over hardcoded values throughout the codebase.
