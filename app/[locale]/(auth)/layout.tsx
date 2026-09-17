import { getTranslations } from "next-intl/server";
import { ArrowLeft, Clock3, ShieldCheck, Sparkles } from "lucide-react";

import { Link } from "@/i18n/navigation";

const pointsIcons = [Clock3, ShieldCheck, Sparkles];

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("auth.layout");
  const header = await getTranslations("header");
  const points = t.raw("points") as string[];

  return (
    <div className="grid min-h-screen overflow-hidden bg-background lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-[#07251f] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 -z-10 bg-grid-light" />
        <div className="absolute -top-48 right-[-10%] -z-10 h-140 w-140 rounded-full bg-teal-500/25 blur-[140px]" />
        <div className="absolute -bottom-48 left-[-10%] -z-10 h-120 w-120 rounded-full bg-cyan-500/15 blur-[140px]" />

        <div className="relative flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-teal-400 to-cyan-600 text-white shadow-md shadow-teal-500/20">
            <Sparkles className="h-4.5 w-4.5" />
          </span>
          <span className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold tracking-tight">
              {header("brand")}
            </span>
            <span className="text-sm font-semibold text-white/60">
              {header("brandSub")}
            </span>
          </span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-balance">
            {t("tagline")}
            <span className="mt-1 block text-gradient-teal">
              {t("taglineAccent")}
            </span>
          </h2>
          <p className="mt-5 text-base leading-7 text-white/70">
            {t("description")}
          </p>
          <ul className="mt-10 space-y-4">
            {points.map((point, index) => {
              const Icon = pointsIcons[index] ?? Sparkles;

              return (
                <li key={point} className="flex items-center gap-3">
                  <span className="inline-flex rounded-lg bg-teal-400/15 p-2 text-teal-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-white/85">
                    {point}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="relative text-sm text-white/50">
          © 2026 Fatoora Hub. All rights reserved.
        </p>
      </aside>

      <main className="relative flex flex-col items-center px-6 py-10 lg:justify-center">
        <div className="absolute -top-24 right-[-10%] -z-10 h-105 w-105 rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="absolute -bottom-24 left-[-10%] -z-10 h-90 w-90 rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="mb-8 flex w-full max-w-md items-center justify-between lg:hidden">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-teal-400 to-cyan-600 text-white shadow-md shadow-teal-500/20">
              <Sparkles className="h-4.5 w-4.5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              {header("brand")}
            </span>
          </div>
        </div>

        <div className="mb-6 flex w-full max-w-md items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("backHome")}
          </Link>
        </div>

        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
