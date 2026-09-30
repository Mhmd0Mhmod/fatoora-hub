import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Plan = {
  name: string;
  price: string;
  priceNote: string;
  annual: string;
  invoices: string;
  taxpayers: string;
  devices: string;
  audience: string;
  support: string;
  cta: string;
  popular?: boolean;
};

/** Limits and SLA, rendered as a stacked spec sheet inside each card. */
const specRows = ["invoices", "taxpayers", "devices", "support"] as const;

function Spec({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-sm font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

export default async function Pricing() {
  const t = await getTranslations("pricing");
  const plans = t.raw("plans") as Plan[];

  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold text-primary uppercase tracking-wide">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mb-10 flex flex-col items-start gap-4 rounded-2xl border border-teal-500/25 bg-gradient-to-r from-teal-500/[0.07] to-cyan-500/[0.04] p-7 sm:flex-row sm:items-center">
          <span className="inline-flex shrink-0 items-center rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 px-3 py-1 text-xs font-semibold text-white">
            {t("pilotTitle")}
          </span>
          <p className="text-sm leading-6 text-foreground/80">{t("pilotDesc")}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "gap-0 overflow-hidden py-0 transition-shadow",
                plan.popular
                  ? "ring-2 ring-teal-500/60 shadow-lg"
                  : "ring-foreground/10 hover:shadow-md",
              )}
            >
              {plan.popular && (
                <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 to-cyan-600" />
              )}

              <div
                className={cn(
                  "flex flex-1 flex-col gap-6 p-6",
                  plan.popular && "bg-gradient-to-b from-teal-500/[0.06] to-transparent",
                )}
              >
                <div className="flex flex-col gap-3">
                  {/* min-h reserves the badge's row so prices stay aligned across cards */}
                  <div className="flex min-h-7 items-center gap-2">
                    <h3 className="font-heading text-lg font-bold">
                      {plan.name}
                    </h3>
                    {plan.popular && (
                      <Badge className="rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 px-2.5 text-[11px] text-white">
                        {t("mostPopular")}
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-extrabold tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {plan.priceNote}
                    </span>
                    {plan.annual && (
                      <span className="mt-1 inline-flex w-fit items-center rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {plan.annual}
                      </span>
                    )}
                  </div>
                </div>

                <dl className="flex flex-col gap-3.5 border-t pt-5">
                  {specRows.map((row) => (
                    <Spec
                      key={row}
                      label={t(`rows.${row}`)}
                      value={plan[row]}
                    />
                  ))}
                </dl>

                <div className="mt-auto flex flex-col gap-1 border-t pt-5">
                  <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                    {t("rows.audience")}
                  </span>
                  <p className="text-sm leading-6">{plan.audience}</p>
                </div>

                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {(
            ["api", "dashboard", "exemptions", "health", "updates"] as const
          ).map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Check className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
              {t(`included.${item}`)}
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-6 text-muted-foreground">
          {t("footnote")}
        </p>
      </div>
    </section>
  );
}