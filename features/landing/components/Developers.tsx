import { Blocks } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function Developers() {
  const t = await getTranslations("developers");
  const items = t.raw("items") as { title: string; description: string }[];
  const lines = t.raw("terminal.lines") as string[];

  return (
    <section
      id="developers"
      className="relative isolate overflow-hidden bg-slate-950 py-24 text-white md:py-32"
    >
      <div className="absolute inset-0 -z-10 bg-grid-light" />
      <div className="absolute -right-40 top-0 -z-10 h-[480px] w-[480px] rounded-full bg-teal-500/15 blur-[140px]" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold text-teal-300 uppercase tracking-wide">
              {t("eyebrow")}
            </p>
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/70">
              {t("subtitle")}
            </p>

            <ul className="mt-10 space-y-6">
              {items.map((item) => {
                return (
                  <li key={item.title} className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-teal-300">
                      <Blocks className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-white/60">
                        {item.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <div className="rounded-2xl border border-white/10 bg-[#0a1120] p-6 shadow-2xl shadow-black/40">
              <div className="mb-5 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <span className="h-3 w-3 rounded-full bg-green-400/80" />
                <span className="ml-2 text-sm font-medium text-white/60">
                  {t("terminal.title")}
                </span>
              </div>
              <pre className="overflow-x-auto font-mono text-sm leading-7">
                {lines.slice(0, 1).map((line, i) => (
                  <code key={i} className="text-white/80">
                    {line}
                  </code>
                ))}
                {lines.slice(1, 3).map((line, i) => (
                  <code key={i} className="block text-white/50">
                    {line}
                  </code>
                ))}
                {lines.slice(3, 4).map((line, i) => (
                  <code key={i} className="block text-white/50">
                    {line}
                  </code>
                ))}
                {lines.slice(4).map((line, i) => (
                  <code key={i} className="block text-teal-300">
                    {line}
                  </code>
                ))}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}