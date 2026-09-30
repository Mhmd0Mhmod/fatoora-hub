import { KeyRound, Landmark, Layers } from "lucide-react";
import { getTranslations } from "next-intl/server";

const icons = [Landmark, KeyRound, Layers];

export default async function Security() {
  const t = await getTranslations("security");
  const items = t.raw("items") as { title: string; description: string }[];

  return (
    <section id="security" className="border-b border-border/60 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.6fr] lg:gap-16">
          <div>
            <p className="mb-3 text-sm font-semibold text-primary uppercase tracking-wide">
              {t("eyebrow")}
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-balance md:text-3xl">
              {t("title")}
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {items.map((item, index) => {
              const Icon = icons[index] ?? Layers;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
