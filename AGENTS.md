<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# FatooraHub

Arabic-first app for "FatooraHub (محور فاتورة)". Next.js 16.3.5 + React 19 + Tailwind v4, internationalized with **next-intl v4**, server-rendered with **Partial Prerendering**. Front-end talks to a .NET backend at `NEXT_PUBLIC_NET_API`.

## Commands
- Use `bun` everywhere (`packageManager: bun@1.4.2`, `bun.lock`). No npm/yarn.
- Scripts: `bun run dev`, `bun run build`, `bun run lint`. Typecheck: `bunx tsc --noEmit` (currently passes). No tests, no CI.
- `bun run lint` currently fails: pre-existing error in `hooks/use-mobile.ts` (`react-hooks/set-state-in-effect`, a shadcn sidebar helper) plus a warning in `features/auth/components/login-form.tsx` (unused `AxiosError` import). Ignore both unless you touch those files.

## Architecture — server-rendered, NOT static export
- `next.config.ts` has **no `output: "export"`** — don't add it: `cacheComponents: true` (PPR) errors in export mode. Keep `cacheComponents`, `partialPrefetching`, `reactCompiler`, and `experimental.turbopackRustReactCompiler` as-is.
- Locale negotiation runs in **`proxy.ts` at project root** (Next 16 renamed Middleware → Proxy). It's the next-intl middleware, driving all locale routing.
- There is **no `app/layout.tsx` or `app/page.tsx`** — `[locale]` is a root param. `i18n/request.ts` reads the locale via `next/root-params` (`rootParams.locale()`); using `next/root-params` here is correct and must stay (a root pass-through layout would break the build).
- All routes are locale-prefixed (`localePrefix: "always"` in `i18n/routing.ts`): `/en`, `/ar`. The proxy redirects bare `/`.
- `createNextIntlPlugin()` in `next.config.ts` is called with no args → resolves `./i18n/request.ts` by convention.
- Use the wrappers in `i18n/navigation.ts` (`Link`, `redirect`, `usePathname`, `useRouter`, `getPathname`) for all links/navigation, **not** `next/navigation` or plain `/path` strings, so locale prefixes apply.
- Static shell + streaming (PPR): `app/[locale]/layout.tsx` uses `generateStaticParams` + `setRequestLocale`; set `lang`/`dir` on `<html>` from locale (no hardcoded `dir="rtl"` in components). RTL components instead use logical props / Radix `Direction` via `components/ui/direction.tsx` (wraps the app in `app/[locale]/layout.tsx`).
- SEO metadata is per-page via `generateMetadata` in `app/[locale]/page.tsx` (localized title/description, canonical, hreflang alternates).
- All content lives in `i18n/messages/{en,ar}.json`, namespaced per section (header/hero/features/developers/pricing/faq/footer/dashboard/auth/meta), read with `useTranslations` (client) / `getTranslations` + `t.raw(...)` for arrays (server).
- `app/not-found.tsx` sits **outside** `[locale]` — rendered 404s are hardcoded English with no i18n.

## API / auth layer
- `lib/api.ts` → `${NEXT_PUBLIC_NET_API}/api/v1` (axios, `withCredentials` + `fetchOptions.credentials: "include"`). `lib/api-auth.ts` → `${NEXT_PUBLIC_NET_API}/api` with an interceptor that adds `Authorization: Bearer` from the `token` cookie via `cookies-next/server`. **Requires `.env.local`** with `NEXT_PUBLIC_NET_API` (e.g. `https://fatoorahub.runasp.net`); gitignored, a fresh clone must recreate it.
- Auth is **server-action based**, not client axios: `features/auth/actions.ts` `loginAction` POSTs `/auth/login` through `lib/api.ts`, then copies the response `Set-Cookie` header entries into the cookie store (`httpOnly`, `secure` in prod). The resulting session cookie is `token`.
- `features/auth/`: `types.ts` (`User`), `vaildators.ts` (**note the misspelled filename**), `components/login-form.tsx` (react-hook-form + zod + React Query `useMutation`; on success seeds the `["me"]` cache and `router.replace("/dashboard")`).
- React Query is wired app-wide: `context/QueryContext.tsx` wraps the layout. `hooks/use-auth.ts` fetches `queryKey: ["me"]` → `/auth/me`.
- Auth routes: `/login` is fully built; `/signup` is a stub. Split-panel shell in `app/[locale]/(auth)/layout.tsx`.

## Dashboard
- `app/[locale]/dashboard/layout.tsx`: `SidebarProvider` shell driven by `components/layouts/dashboard-sidebar.tsx` (a client component picking `side` from the locale, active-item logic via `pathname.startsWith`).
- Static page-layout kit in `components/layouts/` (server components, no interactivity): `DashboardPage`/`DashboardPageHeader` (title/subtitle/actions + padded container), `DashboardSection` (Card wrapper with optional title/description/action), `DashboardStat`/`DashboardStatGrid` (responsive stat cards). Use these for dashboard pages instead of hand-rolling headers/cards.
- Sub-pages (`/dashboard/api-keys`, `clients`, `devices`, `invoices`, `reports`, `tax-exemptions`, `taxpayers`) are placeholder stubs (empty state) composed from the layout kit. The sidebar also links to `/dashboard/settings` and `/dashboard/support`, which have no pages yet. Localized via the `dashboard` namespace (`pages.*`, `stats.*`, `empty.*` alongside `title`/`subtitle`/`sidebar`).

## Styling and structure
- Tailwind v4, CSS-first. Tokens live in **`app/globals.css`** (imported from `app/[locale]/layout.tsx` via `../globals.css`): `@import "tailwindcss"` + `@import "shadcn/tailwind.css"` (the shadcn theme ships from the `shadcn` npm package — `node_modules/shadcn/dist/tailwind.css`, a runtime import, not just a CLI) + `tw-animate-css`; dark mode via `@custom-variant dark`. **No `tailwind.config`.**
- Gotcha: decorative classes `bg-grid-light`, `bg-grid-dark`, `text-gradient-teal`, `text-gradient-dark` are used throughout the landing/auth UI but defined nowhere in the repo (search `app/globals.css` and the shadcn import) → they render as no-ops under Tailwind v4.
- `components.json`: `"style": "radix-vega"`, `"rtl": true`, CSS path `app/globals.css` (that path is correct — don't move it to `[locale]`), lucide icons, consolidated `radix-ui` package (e.g. `import { Direction } from "radix-ui"`). `cn` is re-exported from the `cn` npm package at `lib/utils.ts` (not clsx+tailwind-merge).
- Path alias `@/*` → repo root. Landing sections in `features/landing/components/`, reusable UI in `components/ui/` (`components/ui/sidebar.tsx` is the latest shadcn add), feature folders under `features/` (e.g. `features/clients/` is empty scaffolding), hooks in `hooks/`.
- Fonts: `next/font/google` (Cairo, Tenor Sans, JetBrains Mono) fetched at build time, so offline `bun run build` fails.

## Design notes
- Modern teal/cyan scheme (`oklch` teal tokens in `globals.css`): dark hero, slate developers section, gradient accents; brand name is "محور فاتورة / Fatoora Hub".
- In-page jumps use plain `<a href="#...">`; cross-page links (`/login`, `/signup`) use the next-intl `Link` (locale-prefixed).