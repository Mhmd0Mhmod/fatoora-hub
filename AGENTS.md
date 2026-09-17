<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# FatooraHub

Arabic-first app for "FatooraHub (محور فاتورة)". Next.js 16.3.5 + React 19 + Tailwind v4, internationalized with **next-intl v4**, server-rendered with **Partial Prerendering**. Front-end talks to a .NET backend at `NEXT_PUBLIC_NET_API`.

## Commands
- Use `bun` everywhere (`packageManager: bun@1.4.2`, `bun.lock`). No npm/yarn.
- Scripts: `bun run dev`, `bun run build`, `bun run lint`. No tests, no test/CI setup. Typecheck with `bunx tsc --noEmit` (currently passes).
- `bun run lint` currently fails with 1 pre-existing error in `hooks/use-mobile.ts` (`react-hooks/set-state-in-effect`, a shadcn sidebar helper) — ignore unless you touch that file.

## Architecture — server-rendered, NOT static export
- `next.config.ts` has **no `output: "export"`** — that was removed (commit "fix locale issues") in favor of a dynamic build. Do **not** re-add it: `cacheComponents: true` (PPR) errors in export mode. Keep `cacheComponents`, `partialPrefetching`, `reactCompiler`, and `experimental.turbopackRustReactCompiler` as-is.
- Locale negotiation runs in **`proxy.ts` at project root** (Next 16 renamed Middleware → Proxy; verified in `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`). It's the next-intl middleware, driving all locale routing.
- There is **no `app/layout.tsx` or `app/page.tsx`** — `[locale]` is a root param. `i18n/request.ts` reads the locale via `next/root-params` (`rootParams.locale()`); using `next/root-params` here is correct and must stay (a root pass-through layout would break the build).
- All routes are locale-prefixed (`localePrefix: "always"` in `i18n/routing.ts`): `/en`, `/ar`. The proxy redirects bare `/`.
- `createNextIntlPlugin()` in `next.config.ts` is called with no args → resolves `./i18n/request.ts` by convention.
- Use the wrappers in `i18n/navigation.ts` (`Link`, `redirect`, `useRouter`, `getPathname`) for links/navigation, not `next/navigation`, so locale prefixes apply.
- Static shell + streaming (PPR): `app/[locale]/layout.tsx` uses `generateStaticParams` + `setRequestLocale` (in `app/[locale]/page.tsx` too); set `lang`/`dir` on `<html>` from locale (no hardcoded `dir="rtl"` in components).
- SEO metadata is per-page via `generateMetadata` in `app/[locale]/page.tsx` (localized title/description, canonical, hreflang alternates).
- All content lives in `i18n/messages/{en,ar}.json`, namespaced per section (header/hero/features/developers/pricing/faq/footer/meta), read with `useTranslations` (client) / `getTranslations` + `t.raw(...)` for arrays (server).

## API / auth layer
- `lib/api.ts` and `lib/api-auth.ts` are axios clients whose base is `${process.env.NEXT_PUBLIC_NET_API}/api`. **Requires `.env.local`** with `NEXT_PUBLIC_NET_API` (e.g. `https://fatoorahub.runasp.net`). `.env.local` is gitignored — a fresh clone must recreate it or API calls break.
- `lib/api-auth.ts` adds a request interceptor that reads the `token` cookie via `cookies-next/server` `getCookie` and sets `Authorization: Bearer …` (server-side only).
- Auth scaffolding in `features/auth/` (`types.ts`, zod `validators.ts` — note the misspelled filename `vaildators.ts` if you reference it) + form libs (`react-hook-form`, `zod`, `@hookform/resolvers`).
- Auth pages are stubs under `app/[locale]/(auth)/`: `login`/`register` currently render a literal `"page"`.

## Styling and structure
- Tailwind v4, CSS-first: tokens live in `app/[locale]/globals.css` (`@import "tailwindcss"` + `shadcn/tailwind.css` + `tw-animate-css`; dark mode via `@custom-variant dark`). No `tailwind.config`. Custom `@utility` helpers there: `bg-grid-light`, `bg-grid-dark`, `text-gradient-teal`, `text-gradient-dark`.
- `components.json` is stale: it points shadcn CLI's CSS at `app/globals.css`, but the real file is `app/[locale]/globals.css` — `shadcn add` appends tokens to the wrong path; merge manually.
- shadcn/ui style `radix-nova`, `"rtl": true`, lucide icons, consolidated `radix-ui` package (e.g. `import { Direction } from "radix-ui"`). `cn` is re-exported from the `cn` npm package at `lib/utils.ts` (not clsx+tailwind-merge).
- Path alias `@/*` → repo root. Page sections in `features/landing/components/` (Header, Hero, Pricing, FAQ, …), reusable UI in `components/ui/` (`components/ui/sidebar.tsx` is the latest), other hooks in `hooks/`.
- `app/[locale]/layout.tsx` loads Google fonts (Cairo, Tenor Sans, JetBrains Mono) via `next/font`; they're fetched at build time, so offline builds fail.

## Design notes
- Modern teal/cyan scheme (`oklch` teal tokens in `globals.css`): dark hero, slate developers section, gradient accents; brand name is "محور فاتورة / Fatoora Hub".
- In-page jumps use plain `<a href="#...">`; cross-page links (`/login`, `/signup`) use the next-intl `Link` (locale-prefixed).