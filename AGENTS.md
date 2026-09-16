<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# FatooraLink

Arabic-first landing site for "FatooraHub (محور فاتورة)". Next.js 16 + React 19 + Tailwind v4, internationalized with **next-intl v4**, built as a **static export** for SEO (`next.config.ts` has `output: "export"`; output lands in `out/`).

## Commands
- Use `bun` everywhere (`packageManager: bun@1.4.2`, `bun.lock`). No npm/yarn.
- Available scripts: `bun run dev`, `bun run build`, `bun run lint` (flat-config eslint). No tests, no typecheck script, no CI. (Verify typecheck with `bunx tsc --noEmit`.)

## Static export architecture (no server, no middleware)
- `next.config.ts` sets `output: "export"`. **`cacheComponents` and `partialPrefetching` must stay off** — `cacheComponents` enables PPR, which errors at build ("PPR cannot be enabled in export mode").
- There is **no `proxy.ts`/`middleware.ts`** — static export can't run middleware. The next-intl middleware was deleted in favor of statically generated locale routes.
- All routes are locale-prefixed (`localePrefix: "always"` in `i18n/routing.ts`): `/en`, `/ar`. The root `/` is handled by `app/page.tsx` (redirects to `/en`) with a pass-through root layout `app/layout.tsx` (needed because `app/[locale]/layout.tsx` renders `<html>`, and without `app/layout.tsx` the `[locale]` segment is a root param — which breaks the build after the root layout is added).
- `createNextIntlPlugin()` in `next.config.ts` is called with no args → it resolves `./i18n/request.ts` by convention.
- `i18n/request.ts` reads the locale from the `requestLocale` getter (set via `setRequestLocale` in `app/[locale]/layout.tsx`), **not** from `next/root-params`. Importing `next/root-params` fails the build now that `app/layout.tsx` exists.
- For links/navigation use the wrappers in `i18n/navigation.ts` (`Link`, `redirect`, `useRouter`, `getPathname`), not `next/navigation`, so locale prefixes apply.
- SEO metadata is per-page via `generateMetadata` in `app/[locale]/page.tsx` (localized title/description, canonical, hreflang alternates). `tools/`-free: `routing.locales` drives `generateStaticParams` in `app/[locale]/layout.tsx`.
- All content lives in `i18n/messages/{en,ar}.json` (namespaced per section: header/hero/features/developers/pricing/faq/footer/meta) and is read with `useTranslations` (client) / `getTranslations` + `t.raw(...)` for arrays (server). `app/[locale]/layout.tsx` sets `lang`/`dir` from the locale — there are no more hardcoded `dir="rtl"` attributes in components.

## Styling and structure
- Tailwind v4, CSS-first: tokens live in `app/[locale]/globals.css` (`@import "tailwindcss"` + `shadcn/tailwind.css` + `tw-animate-css`; dark mode via `@custom-variant dark`). No `tailwind.config`. Custom `@utility` helpers (`bg-grid-light`, `bg-grid-dark`, `text-gradient-teal`, `text-gradient-dark`) are also defined there.
- shadcn/ui config in `components.json`: style `radix-nova`, `"rtl": true`, lucide icons, and the consolidated `radix-ui` package (e.g. `import { Direction } from "radix-ui"`).
- `cn` is re-exported from the `cn` npm package at `lib/utils.ts` (not clsx+tailwind-merge). Import from `@/lib/utils`.
- Path alias `@/*` maps to the repo root.
- Page sections live in `features/landing/components/` (Header, Hero, Pricing, FAQ, …); reusable UI in `components/ui/`. New pages/components should follow this split.
- `layout.tsx` loads Google fonts (Cairo, Tenor Sans, JetBrains Mono) via `next/font`; `bun run build` fetches them at build time, so offline builds fail.

## Design notes
- Modern teal/cyan scheme: dark hero (`bg-[#07251f]`), `slate-950` developers section, gradient accents; brand name is "محور فاتورة / Fatoora Hub".
- Headers/anchors use plain `<a href="#...">` for in-page jumps; cross-page links (`/login`, `/signup`) use the next-intl `Link` (locale-prefixed).
