"use client";

import { formatDate } from "date-fns";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Gauge,
  IdCard,
  Monitor,
  Wallet,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardSection } from "@/features/dashboard/components/dashboard-section";
import {
  DashboardStat,
  DashboardStatGrid,
} from "@/features/dashboard/components/dashboard-stat";

import {
  useDashboardActivity,
  useDashboardSummary,
} from "../hooks/use-dashboard-summary";
import { InvoiceStatus } from "../types";

const statusVariants: Record<
  InvoiceStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  Pending: "outline",
  Reported: "secondary",
  Cleared: "default",
  Rejected: "destructive",
  Failed: "destructive",
};

export function DashboardOverview() {
  const t = useTranslations("dashboard.overview");
  const statT = useTranslations("dashboard.stats");
  const walletT = useTranslations("dashboard.overview.wallet");
  const actionT = useTranslations("dashboard.overview.actionItems");
  const activityT = useTranslations("dashboard.overview.activity");
  const statusT = useTranslations("dashboard.invoices.status");

  const summary = useDashboardSummary();
  const activity = useDashboardActivity(8);

  if (summary.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (summary.isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle />
        <AlertTitle>{t("errorTitle")}</AlertTitle>
        <AlertDescription>{t("errorDescription")}</AlertDescription>
      </Alert>
    );
  }

  const data = summary.data;
  if (!data) return null;

  const { wallet, invoicingToday, actionItems } = data;
  const activityItems = activity.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <DashboardStatGrid>
        <DashboardStat
          label={statT("invoices")}
          value={invoicingToday.total}
          description={t("today")}
          icon={<FileText className="size-5" />}
        />
        <DashboardStat
          label={statT("passRate")}
          value={`${data.passRatePercentage}%`}
          description={t("currentCycle")}
          icon={<Gauge className="size-5" />}
        />
        <DashboardStat
          label={statT("devices")}
          value={data.devicesCount}
          icon={<Monitor className="size-5" />}
        />
        <DashboardStat
          label={statT("taxpayers")}
          value={data.taxpayersCount}
          icon={<IdCard className="size-5" />}
        />
      </DashboardStatGrid>

      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardSection
          title={walletT("title")}
          description={walletT("description")}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Wallet className="size-4 text-muted-foreground" />
                <span className="font-medium">{wallet.planName}</span>
              </div>
              <Badge
                variant={wallet.walletStatus === "Active" ? "default" : "destructive"}
              >
                {walletT(`status.${wallet.walletStatus}`)}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  {walletT("monthlyAvailable")}
                </p>
                <p className="text-lg font-semibold tabular-nums">
                  {wallet.monthlyAvailable.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {walletT("monthlyQuota")}
                </p>
                <p className="text-lg font-semibold tabular-nums">
                  {wallet.monthlyQuota.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {walletT("topUpAvailable")}
                </p>
                <p className="text-lg font-semibold tabular-nums">
                  {wallet.topUpAvailable.toLocaleString()}
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              {walletT("cycleEnds")}{" "}
              <span className="tabular-nums">
                {formatDate(wallet.currentCycleEndDateUtc, "P")}
              </span>
            </p>
          </div>
        </DashboardSection>

        <DashboardSection
          title={actionT("title")}
          description={actionT("description")}
        >
          <ul className="flex flex-col gap-3">
            <ActionItem
              icon={<XCircle className="size-4" />}
              label={actionT("rejected")}
              count={actionItems.rejectedCount}
            />
            <ActionItem
              icon={<AlertTriangle className="size-4" />}
              label={actionT("failed")}
              count={actionItems.failedCount}
            />
            <ActionItem
              icon={<Clock className="size-4" />}
              label={actionT("pendingSla")}
              count={actionItems.pendingApproachingSlaCount}
            />
            <ActionItem
              icon={<Monitor className="size-4" />}
              label={actionT("devicesExpiring")}
              count={actionItems.devicesExpiringSoonCount}
            />
          </ul>
        </DashboardSection>
      </div>

      <DashboardSection
        title={activityT("title")}
        description={activityT("description")}
      >
        {activity.isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : activityItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {activityT("empty")}
          </p>
        ) : (
          <ul className="flex flex-col divide-y">
            {activityItems.map((item) => (
              <li
                key={item.uuid}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 first:pt-0 last:pb-0"
              >
                <CheckCircle2 className="size-4 shrink-0 text-muted-foreground" />
                <span className="font-medium tabular-nums">
                  {item.invoiceNumber}
                </span>
                <Badge variant={statusVariants[item.status]}>
                  {statusT(item.status)}
                </Badge>
                <span className="truncate text-sm text-muted-foreground">
                  {item.taxpayerName} · {item.deviceName}
                </span>
                <span className="ms-auto shrink-0 text-xs text-muted-foreground tabular-nums">
                  {formatDate(item.createdAtUtc, "P")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </DashboardSection>
    </div>
  );
}

function ActionItem({
  icon,
  label,
  count,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <li className="flex items-center gap-3">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-sm">{label}</span>
      <Badge
        variant={count > 0 ? "destructive" : "secondary"}
        className="ms-auto tabular-nums"
      >
        {count}
      </Badge>
    </li>
  );
}
