"use client";

import { formatDate } from "date-fns";
import { AlertTriangle, Download, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  downloadInvoicePdf,
  useInvoiceDetails,
  useRetryInvoice,
} from "@/features/dashboard/hooks/use-invoices";
import { InvoiceStatus } from "@/features/dashboard/types";
import { getApiErrorMessage } from "@/lib/api-error";

import { SignedInvoiceXml } from "./signed-invoice-xml";

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

const timeline = [
  "createdAtUtc",
  "reportedAtUtc",
  "clearedAtUtc",
  "rejectedAtUtc",
  "failedAtUtc",
  "lastRetryAtUtc",
] as const;

export function InvoiceDetailsDialog({
  invoiceNumber,
  onOpenChange,
}: {
  invoiceNumber: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("dashboard.invoices.detail");
  const invoicesT = useTranslations("dashboard.invoices");

  const query = useInvoiceDetails(invoiceNumber);
  const retry = useRetryInvoice();
  const [isDownloading, setIsDownloading] = useState(false);

  const details = query.data;

  // The API may return a hosted image URL or a raw base64 PNG.
  const qrCode = details?.qrCodeImage
    ? details.qrCodeImage
    : details?.base64QrCode
      ? `data:image/png;base64,${details.base64QrCode}`
      : null;

  async function handleDownload() {
    if (!invoiceNumber) return;

    setIsDownloading(true);
    try {
      await downloadInvoicePdf(invoiceNumber);
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("pdfError")));
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <Dialog
      open={Boolean(invoiceNumber)}
      onOpenChange={(open) => {
        if (!open) onOpenChange(false);
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-mono tabular-nums">
            {invoiceNumber}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        {query.isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-40 w-full rounded-md" />
          </div>
        ) : query.isError || !details ? (
          <Alert variant="destructive">
            <AlertTriangle />
            <AlertTitle>{t("errorTitle")}</AlertTitle>
            <AlertDescription>{t("errorDescription")}</AlertDescription>
          </Alert>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={statusVariants[details.status]}>
                {invoicesT(`status.${details.status}`)}
              </Badge>
              <Badge variant="outline">
                {invoicesT(`type.${details.invoiceType}`)}
              </Badge>
              <span className="text-xs text-muted-foreground tabular-nums">
                {t("icv", { icv: details.icv })}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {t("attempts", { attempts: details.submissionAttempts ?? 0 })}
              </span>
            </div>

            {details.lastError ? (
              <Alert variant="destructive">
                <AlertTriangle />
                <AlertTitle>{t("lastErrorTitle")}</AlertTitle>
                <AlertDescription className="font-mono text-xs">
                  {details.lastError}
                </AlertDescription>
              </Alert>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <div className="flex flex-col gap-3">
                <Field label={t("uuid")} value={details.uuid} mono />
                <Field label={t("hash")} value={details.invoiceHash} mono />
              </div>

              {qrCode ? (
                <Image
                  src={qrCode}
                  alt={t("qrCodeAlt")}
                  width={128}
                  height={128}
                  unoptimized
                  className="size-32 rounded-lg border bg-white p-1.5 object-contain"
                />
              ) : null}
            </div>

            <Separator />

            <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {timeline.map((key) =>
                details[key] ? (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">
                      {t(`timeline.${key}`)}
                    </span>
                    <span className="ms-auto tabular-nums">
                      {formatDate(details[key] as string, "PPpp")}
                    </span>
                  </div>
                ) : null,
              )}
            </div>

            <Separator />

            <SignedInvoiceXml
              base64SignedInvoice={details.base64SignedInvoice}
              invoiceNumber={details.invoiceNumber}
            />
          </div>
        )}

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={retry.isPending}
          >
            {t("close")}
          </Button>

          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <Download />
            {isDownloading ? t("downloading") : t("downloadPdf")}
          </Button>

          {details?.status === "Failed" ? (
            <Button
              onClick={() => {
                if (!invoiceNumber) return;
                retry.mutate(invoiceNumber, {
                  onSuccess: (data) => {
                    if (data.warnings?.length) {
                      toast.warning(data.warnings.join(" "));
                    } else {
                      toast.success(t("retrySuccess"));
                    }
                  },
                  onError: (error) =>
                    toast.error(getApiErrorMessage(error, t("retryError"))),
                });
              }}
              disabled={retry.isPending}
            >
              <RotateCcw />
              {retry.isPending ? t("retrying") : t("retry")}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={`break-all text-xs ${mono ? "font-mono" : ""}`}
        dir={mono ? "ltr" : undefined}
      >
        {value}
      </span>
    </div>
  );
}
