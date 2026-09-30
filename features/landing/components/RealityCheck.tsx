import { ArrowDown, Boxes, ServerCog } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function RealityCheck() {
  const t = await getTranslations("realityCheck");
  const sdkItems = t.raw("sdkItems") as string[];
  const hubItems = t.raw("hubItems") as string[];

  return (
    <section
      id="reality"
      className="relative overflow-hidden border-y border-border/60 bg-background py-24 md:py-32"
    >
      <div className="absolute left-1/2 top-0 -z-10 h-64 w-[720px] -translate-x-1/2 rounded-full bg-teal-500/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold text-primary uppercase tracking-wide">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_auto_1.35fr] lg:items-stretch lg:gap-0">
          {/* What the official SDK gives you */}
          <div className="rounded-3xl border border-border/70 bg-muted/40 p-7">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <Boxes className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold">{t("sdkTitle")}</h3>
            </div>

            <ul className="mt-6 space-y-3">
              {sdkItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                  <span dir="ltr" className="font-mono text-[13px]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* The gap */}
          <div className="flex items-center justify-center py-2 lg:px-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-300">
              <ArrowDown className="h-5 w-5 lg:hidden" />
              <ServerCog className="hidden h-5 w-5 lg:block" />
            </span>
          </div>

          {/* What FatooraHub operates */}
          <div className="relative overflow-hidden rounded-3xl border border-teal-500/25 bg-gradient-to-br from-teal-500/[0.07] to-cyan-500/[0.04] p-7">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-400/10 blur-3xl" />

            <div className="relative flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-600 text-white shadow-md shadow-teal-500/25">
                <ServerCog className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold">{t("hubTitle")}</h3>
            </div>

            <ul className="relative mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {hubItems.map((item, index) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-6 text-foreground/85"
                >
                  <span className="mt-0.5 font-mono text-xs font-semibold text-teal-500/80">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mx-auto mt-12 max-w-3xl text-center text-lg font-medium leading-8 text-balance text-foreground/80">
          {t("footer")}
        </p>
      </div>
    </section>
  );
}
