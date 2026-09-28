"use client";

import { formatDate, parseISO } from "date-fns";
import { BarChart3, SearchX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardSection } from "@/features/dashboard/components/dashboard-section";
import {
  DashboardStat,
  DashboardStatGrid,
} from "@/features/dashboard/components/dashboard-stat";

import { useDashboardAnalytics } from "../hooks/use-dashboard-analytics";

const RANGES = [7, 30, 90] as const;

const series = [
  { key: "cleared", color: "bg-emerald-500" },
  { key: "reported", color: "bg-sky-500" },
  { key: "rejected", color: "bg-destructive" },
] as const;

export function ReportsView() {
  const t = useTranslations("dashboard.reports");
  const statT = useTranslations("dashboard.stats");

  const [days, setDays] = useState<number>(30);

  const params = useMemo(() => ({ days }), [days]);
  const query = useDashboardAnalytics(params);

  const metrics = query.data?.dailyMetrics ?? [];
  const max = Math.max(1, ...metrics.map((m) => m.total));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {RANGES.map((range) => (
            <Button
              key={range}
              variant={days === range ? "default" : "outline"}
              size="sm"
              onClick={() => setDays(range)}
            >
              {t(`range.${range}`)}
            </Button>
          ))}
        </div>

        {query.isFetching && !query.isLoading ? (
          <span className="text-xs text-muted-foreground">{t("updating")}</span>
        ) : null}
      </div>

      {query.isLoading ? (
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : query.isError ? (
        <Alert variant="destructive">
          <AlertTitle>{t("errorTitle")}</AlertTitle>
          <AlertDescription>{t("errorDescription")}</AlertDescription>
        </Alert>
      ) : (
        <div
          className={`flex flex-col gap-6 transition-opacity ${
            query.isFetching ? "opacity-60" : ""
          }`}
        >
          <DashboardStatGrid>
            <DashboardStat
              label={statT("invoices")}
              value={query.data?.totalInvoices ?? 0}
              description={t("totalInRange")}
            />
            <DashboardStat
              label={t("cleared")}
              value={metrics.reduce((sum, m) => sum + m.cleared, 0)}
            />
            <DashboardStat
              label={t("reported")}
              value={metrics.reduce((sum, m) => sum + m.reported, 0)}
            />
            <DashboardStat
              label={t("rejected")}
              value={metrics.reduce((sum, m) => sum + m.rejected, 0)}
            />
          </DashboardStatGrid>

          <DashboardSection
            title={t("chartTitle")}
            description={
              query.data
                ? `${formatDate(query.data.fromDateUtc, "P")} — ${formatDate(query.data.toDateUtc, "P")}`
                : undefined
            }
          >
            {metrics.length === 0 ? (
              <Empty className="py-16">
                <EmptyMedia variant="icon">
                  <BarChart3 />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
                  <EmptyDescription>{t("emptyDescription")}</EmptyDescription>
                </EmptyHeader>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDays(90)}
                >
                  <SearchX />
                  {t("range.90")}
                </Button>
              </Empty>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-end gap-1.5 overflow-x-auto pb-1">
                  {metrics.map((metric) => (
                    <div
                      key={metric.date}
                      className="flex w-10 shrink-0 flex-col-reverse gap-0.5"
                      title={`${metric.date}: ${metric.total}`}
                    >
                      {series.map((s) => {
                        const value = metric[s.key];
                        if (!value) return null;
                        return (
                          <div
                            key={s.key}
                            className={`w-full rounded-sm ${s.color}`}
                            style={{ height: `${(value / max) * 120}px` }}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  {series.map((s) => (
                    <span key={s.key} className="flex items-center gap-1.5">
                      <span className={`size-2.5 rounded-sm ${s.color}`} />
                      {t(s.key)}
                    </span>
                  ))}
                  <span className="ms-auto tabular-nums">
                    {formatDate(parseISO(metrics[0].date), "P")} —{" "}
                    {formatDate(parseISO(metrics[metrics.length - 1].date), "P")}
                  </span>
                </div>
              </div>
            )}
          </DashboardSection>

          {metrics.length > 0 ? (
            <DashboardSection title={t("breakdownTitle")}>
              <div className="flex flex-col divide-y">
                {metrics.slice(-10).reverse().map((metric) => (
                  <div
                    key={metric.date}
                    className="flex flex-wrap items-center gap-2 py-2 first:pt-0 last:pb-0"
                  >
                    <span className="w-24 shrink-0 text-sm tabular-nums">
                      {formatDate(parseISO(metric.date), "P")}
                    </span>
                    <Badge variant="secondary" className="tabular-nums">
                      {t("total")} {metric.total}
                    </Badge>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {t("cleared")} {metric.cleared} · {t("reported")}{" "}
                      {metric.reported} · {t("rejected")} {metric.rejected}
                    </span>
                  </div>
                ))}
              </div>
            </DashboardSection>
          ) : null}
        </div>
      )}
    </div>
  );
}
