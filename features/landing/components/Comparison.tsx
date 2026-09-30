import { Check, X } from "lucide-react";
import { getTranslations } from "next-intl/server";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Row = { aspect: string; inhouse: string; hub: string };

export default async function Comparison() {
  const t = await getTranslations("comparison");
  const rows = t.raw("rows") as Row[];

  return (
    <section
      id="compare"
      className="relative overflow-hidden bg-muted/40 py-24 md:py-32"
    >
      <div className="absolute inset-0 -z-10 bg-grid-dark" />

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

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[24%] text-start">{t("aspect")}</TableHead>
                  <TableHead className="w-[38%] text-start text-muted-foreground">
                    {t("inhouse")}
                  </TableHead>
                  <TableHead className="w-[38%] bg-teal-500/[0.06] text-start text-teal-700 dark:text-teal-300">
                    {t("hub")}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.aspect} className="hover:bg-transparent">
                    <TableCell className="align-top font-semibold">
                      {row.aspect}
                    </TableCell>
                    <TableCell className="align-top text-muted-foreground">
                      <span className="flex items-start gap-2.5">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                        <span>{row.inhouse}</span>
                      </span>
                    </TableCell>
                    <TableCell className="align-top bg-teal-500/[0.04]">
                      <span className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                        <span>{row.hub}</span>
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-6 text-muted-foreground">
          {t("footnote")}
        </p>
      </div>
    </section>
  );
}
