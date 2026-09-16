import { CloudCog, QrCode, ShieldCheck, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

const featureIcons = [Sparkles, CloudCog, QrCode, ShieldCheck];

export default async function Features() {
  const t = await getTranslations("features");
  const items = t.raw("items") as { title: string; description: string }[];

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-muted/40 py-24 md:py-32"
    >
      <div className="absolute inset-0 -z-10 bg-grid-dark" />
      <div className="absolute left-1/2 top-0 -z-10 h-64 w-[720px] -translate-x-1/2 rounded-full bg-teal-500/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-4 py-1.5 text-sm font-medium text-teal-700 dark:text-teal-300">
            <Sparkles className="h-3.5 w-3.5" />
            {t("eyebrow")}
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-balance md:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((feature, index) => {
            const Icon = featureIcons[index] ?? Sparkles;

            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/40 hover:shadow-xl hover:shadow-teal-500/10"
              >
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-teal-400/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative flex items-start justify-between">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-600 text-white shadow-md shadow-teal-500/25 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-mono text-sm font-semibold tracking-widest text-muted-foreground/50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold">{feature.title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}