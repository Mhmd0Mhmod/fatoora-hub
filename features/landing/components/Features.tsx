import {
  BookCheck,
  Braces,
  Clock3,
  Cpu,
  GitBranch,
  Link2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

const featureIcons = [
  Braces,
  Link2,
  ShieldCheck,
  GitBranch,
  RefreshCw,
  Clock3,
  Cpu,
  BookCheck,
];

type Item = { title: string; burden: string; relief: string };

export default async function Features() {
  const t = await getTranslations("features");
  const items = t.raw("items") as Item[];

  return (
    <section id="features" className="py-24 md:py-32">
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

        <div className="grid gap-5 md:grid-cols-2">
          {items.map((item, index) => {
            const Icon = featureIcons[index] ?? Braces;

            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/40 hover:shadow-xl hover:shadow-teal-500/10"
              >
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-teal-400/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-600 text-white shadow-md shadow-teal-500/25 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-sm font-semibold tracking-widest text-muted-foreground/40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="relative mt-5 text-lg font-bold">{item.title}</h3>

                <div className="relative mt-4 space-y-3 border-s-2 border-border ps-4">
                  <div>
                    <p className="text-[11px] font-semibold tracking-wide text-muted-foreground/60 uppercase">
                      {t("burdenLabel")}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {item.burden}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold tracking-wide text-teal-600 uppercase dark:text-teal-400">
                      {t("reliefLabel")}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-foreground/85">
                      {item.relief}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
