import { Blocks, Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { cn } from "cn";

import { ApiSamples } from "./ApiSamples";
import { apiEndpoints, apiSamples, type Endpoint } from "../data/api-samples";

const methodTone: Record<Endpoint["method"], string> = {
  GET: "text-sky-300",
  POST: "text-emerald-300",
  DELETE: "text-rose-300",
};

export default async function Developers() {
  const t = await getTranslations("developers");
  const items = t.raw("items") as { title: string; description: string }[];

  return (
    <section
      id="developers"
      className="relative isolate overflow-hidden bg-slate-950 py-24 text-white md:py-32"
    >
      <div className="absolute inset-0 -z-10 bg-grid-light" />
      <div className="absolute -right-40 top-0 -z-10 h-[480px] w-[480px] rounded-full bg-teal-500/15 blur-[140px]" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-14 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold text-teal-300 uppercase tracking-wide">
              {t("eyebrow")}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/70">
              {t("subtitle")}
            </p>

            <ul className="mt-9 space-y-5">
              {items.map((item) => (
                <li key={item.title} className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-teal-300">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/60">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a1120] shadow-2xl shadow-black/40">
            <ApiSamples samples={apiSamples} />
          </div>
        </div>

        <div className="mt-16">
          <div className="flex items-center gap-3">
            <Blocks className="h-4 w-4 text-teal-300" />
            <h3 className="text-sm font-semibold tracking-wide text-white/70 uppercase">
              {t("surfaceTitle")}
            </h3>
          </div>

          <div className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {apiEndpoints.map((endpoint) => (
              <div
                key={`${endpoint.method} ${endpoint.path}`}
                className="flex items-center gap-2.5 border-b border-white/5 py-2"
              >
                <span
                  className={cn(
                    "w-12 shrink-0 font-mono text-[11px] font-semibold",
                    methodTone[endpoint.method],
                  )}
                >
                  {endpoint.method}
                </span>
                <span dir="ltr" className="truncate font-mono text-[13px] text-white/70">
                  {endpoint.path}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
