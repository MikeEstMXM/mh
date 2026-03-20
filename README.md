# Personal App Platform

A lightweight Next.js platform for a home dashboard plus small web applets in one repo.

## What This Repo Is For

- A single launch screen at `/`
- Small applets under `/apps/<slug>`
- Simple structure that stays readable for a non-developer owner
- Low-friction deployment to GitHub Pages or Vercel
- A safe starting point for future server-side API integrations

## Stack

- Next.js 16
- App Router
- TypeScript
- Tailwind CSS v4
- Ready for Vercel deployment

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
copy .env.example .env.local
```

3. Start the dev server:

```bash
npm run dev
```

4. Open `http://localhost:3000`

## Useful Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run format
```

## GitHub Pages

This repo is set up to deploy to GitHub Pages as a static export.

What that means:

- App routes and applet pages work on Pages
- The repo automatically supports a project subpath such as `/mh`
- A GitHub Actions workflow can publish the `out` build output
- Server-backed features are limited on Pages because Pages is static hosting

Important limitation:

- `src/app/api/*` stays in the repo as a safe server-integration foundation, but GitHub Pages cannot run live secret-backed API proxies. For real server-side API calls, deploy to Vercel or another server runtime.

## Project Structure

```text
src/
  app/
    api/
      example/
      health/
    apps/
      ideas/
      notes/
      timer/
    favicon.ico
    globals.css
    layout.tsx
    manifest.ts
    page.tsx
  components/
    layout/
    pwa/
    ui/
  config/
    applets.ts
    site.ts
  features/
    applets/
      ideas/
      notes/
      timer/
  lib/
    server/
    metadata.ts
    utils.ts
  types/
public/
  icons/
  apple-icon.png
  sw.js
```

## How Applets Work

The launch screen and header navigation are both powered by `src/config/applets.ts`.

Each applet has:

- A registry entry in `src/config/applets.ts`
- A route page in `src/app/apps/<slug>/page.tsx`
- Its own implementation folder in `src/features/applets/<slug>/`

This keeps new applets mechanical to add instead of scattered across the repo.

## How To Add A New Applet

1. Add a new entry to `src/config/applets.ts`
2. Create a page route at `src/app/apps/<slug>/page.tsx`
3. Create the applet UI in `src/features/applets/<slug>/`
4. Reuse shared pieces from `src/components/` if the UI pattern might repeat

## Secure API Pattern

- Put secrets only in server-side environment variables
- Keep server-only modules in `src/lib/server/`
- Use route handlers in `src/app/api/` for browser-to-server calls
- Do not put API keys in client components or `NEXT_PUBLIC_*` variables

Example files:

- `src/app/api/health/route.ts`
- `src/app/api/example/route.ts`
- `src/lib/server/env.ts`
- `src/lib/server/example-api.ts`

On GitHub Pages, `/api/example` is intentionally a static status stub. The live server-only pattern still lives in `src/lib/server/example-api.ts` for future Vercel or server-runtime deployment.

## PWA Foundation

Included now:

- `src/app/manifest.ts`
- `public/sw.js`
- `public/icons/`
- `public/apple-icon.png`

Still needed before full production PWA readiness:

- Replace placeholder icons with branded assets
- Test install prompts on iPhone, Android, and desktop
- Decide on an intentional offline caching strategy instead of the current starter cache
- Add notification and background-sync logic only if you actually need them

## Deployment On GitHub Pages

1. Push to GitHub
2. In GitHub, enable Pages with GitHub Actions as the source
3. Let `.github/workflows/deploy-pages.yml` publish the site
4. The site will deploy under `https://<owner>.github.io/<repo>` unless you use a custom domain

For this repo today, the default Pages URL is:

```text
https://mikeestmxm.github.io/mh
```

## Deployment On Vercel

1. Push the repo to GitHub
2. Import the repo into Vercel
3. Add the environment variables from `.env.example`
4. Deploy

Recommended first production variable:

```text
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

## Owner Notes

- Rename the platform in `src/config/site.ts`
- Replace the placeholder icons in `public/icons/` and `public/apple-icon.png`
- Use Codex against this repo by asking it to add or edit a specific applet, route, or shared component
- Keep the project simple until you truly need auth, a database, or cross-device sync
