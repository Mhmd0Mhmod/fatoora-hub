import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Plan = {
  name: string;
  price: string;
  description: string;
  popular?: boolean;
  features: string[];
  cta: string;
};

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

        <div className="grid items-stretch gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.popular
                  ? "relative rounded-2xl border-primary shadow-xl shadow-teal-500/10 lg:-my-4 lg:py-4"
                  : "relative rounded-2xl"
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  {plan.popular && (
                    <Badge className="rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
                      {t("mostPopular")}
                    </Badge>
                  )}
                </div>

                <p className="mt-4 text-3xl font-extrabold">{plan.price}</p>

                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="mt-auto">
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}