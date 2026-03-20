<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Notes

- Treat `src/config/applets.ts` as the single source of truth for launch-screen cards and applet navigation.
- Add new applets in three places only: `src/config/applets.ts`, `src/app/apps/<slug>/page.tsx`, and `src/features/applets/<slug>/`.
- Keep shared UI in `src/components/`, shared utilities in `src/lib/`, and server-only code in `src/lib/server/`.
- Do not expose secrets in `NEXT_PUBLIC_*` variables or client components.
