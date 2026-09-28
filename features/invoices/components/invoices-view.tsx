"use client";

import { endOfDay, formatDate, startOfDay } from "date-fns";
import { FileText, RotateCcw, Search, SearchX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardSection } from "@/features/dashboard/components/dashboard-section";
import {
  DataTable,
  DataTableColumn,
} from "@/features/dashboard/components/data-table";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getApiErrorMessage } from "@/lib/api-error";

import { useInvoices, useRetryFailedInvoices } from "../../dashboard/hooks/use-invoices";
import {
  InvoiceListItemResponse,
  InvoiceStatus,
  InvoiceType,
} from "../../dashboard/types";
import { InvoiceDetailsDialog } from "./invoice-details-dialog";
import { DateRangeFilter } from "./date-range-filter";

const PAGE_SIZE = 10;

const statuses: InvoiceStatus[] = [
  "Pending",
  "Reported",
  "Rejected",
  "Cleared",
  "Failed",
];

const invoiceTypes: InvoiceType[] = [
  "Standard",
  "Simplified",
  "StandardCreditNote",
  "StandardDebitNote",
  "SimplifiedCreditNote",
  "SimplifiedDebitNote",
];

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

export default function InvoicesView() {
  const t = useTranslations("dashboard.invoices");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<InvoiceStatus | "all">("all");
  const [invoiceType, setInvoiceType] = useState<InvoiceType | "all">("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  const retryFailed = useRetryFailedInvoices();
  const debouncedSearch = useDebouncedValue(search, 350);

  const hasFilters =
    debouncedSearch.trim() !== "" ||
    status !== "all" ||
    invoiceType !== "all" ||
    Boolean(dateRange?.from);

  const query = useInvoices(
    useMemo(
      () => ({
        pageNumber: page,
        pageSize: PAGE_SIZE,
        ...(debouncedSearch.trim()
          ? { searchTerm: debouncedSearch.trim() }
          : {}),
        ...(status !== "all" ? { status } : {}),
        ...(invoiceType !== "all" ? { invoiceType } : {}),
        // The API filters on absolute instants, so widen the range to the
        // full local day on either end.
        ...(dateRange?.from
          ? { fromDate: startOfDay(dateRange.from).toISOString() }
          : {}),
        ...(dateRange?.to
          ? { toDate: endOfDay(dateRange.to).toISOString() }
          : {}),
      }),
      [page, debouncedSearch, status, invoiceType, dateRange],
    ),
  );

  const totalCount = query.data?.totalCount ?? 0;
  const totalPages = Math.max(1, query.data?.totalPages ?? 1);
  const from = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, totalCount);

  // Bulk re-queue only covers the failed rows on the current page.
  const failedNumbers =
    query.data?.items
      .filter((invoice) => invoice.status === "Failed")
      .map((invoice) => invoice.invoiceNumber) ?? [];

  function handleRetryFailed() {
    retryFailed.mutate(failedNumbers, {
      onSuccess: (data) =>
        toast.success(
          data.message || t("retryAllSuccess", { count: data.requeuedCount }),
        ),
      onError: (error) => toast.error(getApiErrorMessage(error, t("retryAllError"))),
    });
  }

  const columns: DataTableColumn<InvoiceListItemResponse>[] = useMemo(
    () => [
      {
        key: "number",
        header: t("colNumber"),
        cell: (invoice) => (
          <span className="font-medium tabular-nums">
            {invoice.invoiceNumber}
          </span>
        ),
      },
      {
        key: "type",
        header: t("colType"),
        cell: (invoice) => (
          <span className="text-muted-foreground">
            {t(`type.${invoice.invoiceType}`)}
          </span>
        ),
      },
      {
        key: "status",
        header: t("colStatus"),
        cell: (invoice) => (
          <Badge
            variant={statusVariants[invoice.status]}
            title={invoice.lastError ?? undefined}
          >
            {t(`status.${invoice.status}`)}
          </Badge>
        ),
      },
      {
        key: "issued",
        header: t("colIssued"),
        cell: (invoice) => (
          <span className="text-muted-foreground tabular-nums">
            {formatDate(invoice.createdAtUtc, "P")}
          </span>
        ),
      },
      {
        key: "attempts",
        header: t("colAttempts"),
        align: "end",
        cell: (invoice) => (
          <span className="tabular-nums">
            {invoice.submissionAttempts ?? "—"}
          </span>
        ),
      },
    ],
    [t],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <InputGroup className="w-full sm:w-72">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchLabel")}
          />
        </InputGroup>

        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value as InvoiceStatus | "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder={t("allStatuses")} />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value="all">{t("allStatuses")}</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {t(`status.${s}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={invoiceType}
          onValueChange={(value) => {
            setInvoiceType(value as InvoiceType | "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder={t("allTypes")} />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value="all">{t("allTypes")}</SelectItem>
            {invoiceTypes.map((ty) => (
              <SelectItem key={ty} value={ty}>
                {t(`type.${ty}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DateRangeFilter
          value={dateRange}
          onChange={(range) => {
            setDateRange(range);
            setPage(1);
          }}
        />

        {hasFilters ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setStatus("all");
              setInvoiceType("all");
              setDateRange(undefined);
              setPage(1);
            }}
          >
            <SearchX />
            {t("clearFilters")}
          </Button>
        ) : null}

        {failedNumbers.length > 0 ? (
          <Button
            variant="outline"
            size="sm"
            className="sm:ms-auto"
            onClick={handleRetryFailed}
            disabled={retryFailed.isPending}
          >
            <RotateCcw />
            {retryFailed.isPending
              ? t("retryAllPending")
              : t("retryAll", { count: failedNumbers.length })}
          </Button>
        ) : null}
      </div>

      <DashboardSection contentClassName="px-4">
        <DataTable
          columns={columns}
          items={query.data?.items ?? []}
          getRowId={(invoice) => invoice.invoiceNumber}
          loading={query.isLoading}
          fetching={query.isFetching}
          error={query.isError}
          errorTitle={t("errorTitle")}
          errorDescription={t("errorDescription")}
          empty={{
            icon: <FileText />,
            title: t("emptyTitle"),
            description: t("emptyDescription"),
          }}
          pagination={{
            page,
            totalPages,
            totalCount,
            onPageChange: setPage,
            previousLabel: t("previous"),
            nextLabel: t("next"),
            showingLabel: (total) => t("showing", { from, to, total }),
          }}
          onRowClick={(invoice) => setSelectedInvoice(invoice.invoiceNumber)}
        />
      </DashboardSection>

      <InvoiceDetailsDialog
        invoiceNumber={selectedInvoice}
        onOpenChange={(open) => {
          if (!open) setSelectedInvoice(null);
        }}
      />
    </div>
  );
}
