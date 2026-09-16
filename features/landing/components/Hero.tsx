import { ArrowRight, BadgeCheck, Clock3, ShieldCheck, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

import { Badge } from "@/components/ui/badge";

const highlightIcons = [Clock3, ShieldCheck, Sparkles, BadgeCheck];

export default async function Hero() {
  const t = await getTranslations("hero");
  const highlights = t.raw("highlights") as string[];

  return (
    <section id="hero" className="relative isolate overflow-hidden bg-[#07251f] text-white">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 bg-grid-light" />
      <div className="absolute -top-48 right-[-10%] -z-10 h-[560px] w-[560px] rounded-full bg-teal-500/25 blur-[140px]" />
      <div className="absolute -bottom-48 left-[-10%] -z-10 h-[480px] w-[480px] rounded-full bg-cyan-500/15 blur-[140px]" />
      <div className="absolute left-1/2 top-1/3 -z-10 h-[360px] w-[720px] -translate-x-1/2 rounded-full bg-teal-400/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <Badge
            variant="secondary"
            className="mb-8 rounded-full border-white/10 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur"
          >
            {t("badge")}
          </Badge>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-balance md:text-6xl">
            {t("titlePrefix")}{" "}
            <span className="mt-1 block text-gradient-teal">
              {t("titleAccent")}
            </span>
            <span className="mt-3 block text-2xl font-semibold text-white/70 md:text-3xl">
              {t("titleSuffix")}
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-white/70">
            {t("description")}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 px-8 py-3.5 text-base font-semibold text-teal-950 shadow-lg shadow-teal-500/30 transition hover:shadow-xl hover:shadow-teal-500/40 hover:brightness-110"
            >
              {t("ctaPrimary")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:border-white/30 hover:bg-white/10"
            >
              {t("ctaSecondary")}
            </a>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-4">
          {highlights.map((text, index) => {
            const Icon = highlightIcons[index] ?? Sparkles;

            return (
              <div
                key={text}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/10"
              >
                <div className="mb-3 inline-flex rounded-lg bg-gradient-to-br from-teal-400/20 to-cyan-500/20 p-2.5 text-teal-300">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium leading-6 text-white/85">{text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}