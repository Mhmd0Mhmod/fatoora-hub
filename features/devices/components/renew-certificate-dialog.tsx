"use client";

import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRenewCertificate } from "@/features/dashboard/hooks/use-devices";

export function RenewCertificateDialog({
  deviceId,
  deviceName,
}: {
  deviceId: string;
  deviceName: string;
}) {
  const t = useTranslations("dashboard.devices.renew");
  const renew = useRenewCertificate();

  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState("");

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setOtp("");
      renew.reset();
    }
  }

  function handleSubmit() {
    renew.mutate(
      { deviceId, otp: otp.trim() || undefined },
      {
        onSuccess: (data) => {
          toast.success(data.message || t("success"));
          setOpen(false);
          setOtp("");
        },
        onError: (error) => {
          const detail =
            (error as { response?: { data?: { detail?: string } } })?.response
              ?.data?.detail ?? t("error");

          toast.error(detail);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={t("trigger")}
          title={t("trigger")}
        >
          <RefreshCw />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("description", { name: deviceName })}
          </DialogDescription>
        </DialogHeader>

        <Field>
          <FieldLabel htmlFor={`renew-otp-${deviceId}`}>{t("otp")}</FieldLabel>
          <Input
            id={`renew-otp-${deviceId}`}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            dir="ltr"
            autoComplete="one-time-code"
          />
          <FieldDescription>{t("otpDescription")}</FieldDescription>
        </Field>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={renew.isPending}
          >
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={renew.isPending}>
            <RefreshCw />
            {renew.isPending ? t("renewing") : t("submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
